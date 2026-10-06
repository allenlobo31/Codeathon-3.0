// FEATURE: Share history with status, search, filters and sorting — only your own shares
// GET /api/shares
//   ?q=report                 search by file name OR recipient email
//   &status=active|expired|revoked|limit_reached
//   &from=2026-10-01&to=2026-10-31     created between these dates (inclusive)
//   &sort=createdAt|expiresAt|downloadCount|fileName     (default createdAt)
//   &order=asc|desc                                      (default desc)
const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { buildShareLink } = require('../utils/qr');
const Share = require('../models/Share');
const AccessLog = require('../models/AccessLog');
const { getStatus } = require('../utils/status');

const router = express.Router();

const STATUSES = ['active', 'expired', 'revoked', 'limit_reached'];
const SORTS = ['createdAt', 'expiresAt', 'downloadCount', 'fileName'];
const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

// "2026-10-31" as an end date means the whole day; returns Date or null if invalid
function parseDate(value, endOfDay) {
  const date = new Date(DATE_ONLY.test(value) && endOfDay ? `${value}T23:59:59.999Z` : value);
  return Number.isNaN(date.getTime()) ? null : date;
}

router.get('/', requireAuth, async (req, res) => {
  const q = String(req.query.q || '').trim().toLowerCase();
  const status = String(req.query.status || '');
  const sort = String(req.query.sort || 'createdAt');
  const order = String(req.query.order || 'desc');

  if (status && !STATUSES.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${STATUSES.join(', ')}` });
  }
  if (!SORTS.includes(sort)) return res.status(400).json({ error: `sort must be one of: ${SORTS.join(', ')}` });
  if (!['asc', 'desc'].includes(order)) return res.status(400).json({ error: 'order must be asc or desc' });

  const filter = { owner: req.user._id };
  if (req.query.from || req.query.to) {
    filter.createdAt = {};
    if (req.query.from) {
      const from = parseDate(String(req.query.from), false);
      if (!from) return res.status(400).json({ error: 'from is not a valid date' });
      filter.createdAt.$gte = from;
    }
    if (req.query.to) {
      const to = parseDate(String(req.query.to), true);
      if (!to) return res.status(400).json({ error: 'to is not a valid date' });
      filter.createdAt.$lte = to;
    }
  }

  const shares = await Share.find(filter).populate('file');

  // How many attempts were denied, per share
  const denied = await AccessLog.aggregate([
    { $match: { owner: req.user._id, outcome: 'denied', share: { $in: shares.map((s) => s._id) } } },
    { $group: { _id: '$share', count: { $sum: 1 } } },
  ]);
  const deniedByShare = new Map(denied.map((d) => [String(d._id), d.count]));

  let list = shares.map((share) => ({
    code: share.code,
    link: buildShareLink(share.code),
    fileId: share.file ? share.file._id : null,
    fileName: share.file ? share.file.originalName : 'Deleted file',
    size: share.file ? share.file.size : 0,
    recipients: share.allowedEmails,
    restricted: share.allowedEmails.length > 0,
    createdAt: share.createdAt,
    expiresAt: share.expiresAt,
    revokedAt: share.revokedAt,
    maxDownloads: share.maxDownloads,
    downloadCount: share.downloadCount,
    deniedAttempts: deniedByShare.get(String(share._id)) || 0,
    status: getStatus(share), // always live
  }));

  if (q) {
    list = list.filter(
      (s) => s.fileName.toLowerCase().includes(q) || s.recipients.some((email) => email.includes(q))
    );
  }
  if (status) list = list.filter((s) => s.status === status);

  const dir = order === 'asc' ? 1 : -1;
  list.sort((a, b) => {
    if (sort === 'fileName') return a.fileName.localeCompare(b.fileName) * dir;
    if (sort === 'downloadCount') return (a.downloadCount - b.downloadCount) * dir;
    return (new Date(a[sort]) - new Date(b[sort])) * dir;
  });

  res.json(list);
});

module.exports = router;