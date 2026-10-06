// FEATURE: Create a share (unique code + link + QR) with an expiry time,
//          optional allowed emails and optional download limit — login required
// POST /api/shares
// body: {
//   fileId,
//   // expiry: give exactly ONE of these
//   expiryPreset: "1h" | "24h" | "7d" | "30d",
//   expiresInMinutes: 90,
//   expiresAt: "2026-12-31T18:30:00Z",       (custom date & time)
//   allowedEmails: ["a@x.com", "b@y.com"],   (optional; empty = anyone with the link)
//   maxDownloads: 5                          (optional; empty = unlimited)
// }
const express = require('express');
const mongoose = require('mongoose');
const { requireAuth } = require('../middleware/auth');
const { generateCode } = require('../utils/code');
const { buildShareLink, makeQrDataUrl } = require('../utils/qr');
const File = require('../models/File');
const Share = require('../models/Share');

const router = express.Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PRESET_MINUTES = { '1h': 60, '24h': 24 * 60, '7d': 7 * 24 * 60, '30d': 30 * 24 * 60 };
const MAX_EXPIRY_MS = 365 * 24 * 60 * 60 * 1000; // a share can live at most 1 year
const MAX_ALLOWED_EMAILS = 50;

// Returns { date } or { error }
function resolveExpiry({ expiryPreset, expiresInMinutes, expiresAt }) {
  const given = [expiryPreset, expiresInMinutes, expiresAt].filter((v) => v !== undefined && v !== null && v !== '');
  if (given.length !== 1) {
    return { error: 'Provide exactly one of expiryPreset, expiresInMinutes or expiresAt' };
  }

  let date;
  if (expiryPreset !== undefined && expiryPreset !== null && expiryPreset !== '') {
    if (!PRESET_MINUTES[expiryPreset]) {
      return { error: `expiryPreset must be one of: ${Object.keys(PRESET_MINUTES).join(', ')}` };
    }
    date = new Date(Date.now() + PRESET_MINUTES[expiryPreset] * 60 * 1000);
  } else if (expiresInMinutes !== undefined && expiresInMinutes !== null && expiresInMinutes !== '') {
    const minutes = Number(expiresInMinutes);
    if (!Number.isFinite(minutes) || minutes <= 0) {
      return { error: 'expiresInMinutes must be a positive number' };
    }
    date = new Date(Date.now() + minutes * 60 * 1000);
  } else {
    if (typeof expiresAt !== 'string') return { error: 'expiresAt must be an ISO date string' };
    date = new Date(expiresAt);
    if (Number.isNaN(date.getTime())) return { error: 'expiresAt is not a valid date' };
    if (date <= new Date()) return { error: 'expiresAt must be in the future' };
  }

  if (date.getTime() - Date.now() > MAX_EXPIRY_MS) {
    return { error: 'Expiry cannot be more than 365 days from now' };
  }
  return { date };
}

// Returns { emails } or { error }
function cleanEmails(input) {
  if (input === undefined || input === null) return { emails: [] };
  if (!Array.isArray(input)) return { error: 'allowedEmails must be an array of emails' };
  if (input.length > MAX_ALLOWED_EMAILS) return { error: `At most ${MAX_ALLOWED_EMAILS} allowed emails` };

  const emails = [];
  for (const item of input) {
    if (typeof item !== 'string') return { error: 'allowedEmails must contain only strings' };
    const email = item.trim().toLowerCase();
    if (!EMAIL_RE.test(email)) return { error: `Invalid email in allowedEmails: ${item}` };
    if (!emails.includes(email)) emails.push(email);
  }
  return { emails };
}

router.post('/', requireAuth, async (req, res) => {
  const { fileId, expiryPreset, expiresInMinutes, expiresAt, allowedEmails, deliveryMode = 'view', maxDownloads } = req.body || {};

  if (!fileId || !mongoose.isValidObjectId(fileId)) {
    return res.status(400).json({ error: 'A valid fileId is required' });
  }

  const expiry = resolveExpiry({ expiryPreset, expiresInMinutes, expiresAt });
  if (expiry.error) return res.status(400).json({ error: expiry.error });

  const recipients = cleanEmails(allowedEmails);
  if (recipients.error) return res.status(400).json({ error: recipients.error });

  if (!['view', 'download_once', 'download_allowed'].includes(deliveryMode)) {
    return res.status(400).json({ error: 'deliveryMode must be view, download_once or download_allowed' });
  }

  let limit = null;
  if (deliveryMode === 'download_once') {
    limit = 1;
  } else if (deliveryMode === 'download_allowed') {
    limit = Number(maxDownloads);
    if (!Number.isInteger(limit) || limit < 1 || limit > 100000) {
      return res.status(400).json({ error: 'maxDownloads must be a whole number between 1 and 100000' });
    }
  }

  // You can only share your own files
  const file = await File.findOne({ _id: fileId, owner: req.user._id });
  if (!file) return res.status(404).json({ error: 'File not found' });

  // The code is random; retry in the (practically impossible) case of a duplicate
  let share;
  for (let attempt = 0; attempt < 3 && !share; attempt++) {
    try {
      const code = generateCode();
      const link = buildShareLink(code);
      share = await Share.create({
        code,
        link,
        file: file._id,
        owner: req.user._id,
        expiresAt: expiry.date,
        allowedEmails: recipients.emails,
        deliveryMode,
        maxDownloads: limit,
      });
    } catch (err) {
      if (err.code !== 11000) throw err;
    }
  }
  if (!share) return res.status(500).json({ error: 'Could not generate a unique code, try again' });

  res.status(201).json({
    code: share.code,
    link: share.link || buildShareLink(share.code),
    qr: await makeQrDataUrl(share.link || buildShareLink(share.code)),
    expiresAt: share.expiresAt,
    allowedEmails: share.allowedEmails,
    deliveryMode: share.deliveryMode,
    maxDownloads: share.maxDownloads,
  });
});

module.exports = router;