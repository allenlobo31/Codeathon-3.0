// FEATURE: Download tracking — who tried to open your files, when, and why they were denied
// GET /api/shares/:code/logs      access log of one share
// GET /api/activity               access log of all your shares
//   optional filters on both: ?outcome=allowed|denied &reason=expired &q=someone@x.com &from=2026-10-01 &to=2026-10-31 &page=1 &limit=50
// header: Authorization: Bearer <token>     (you only ever see logs for your own shares)
const express = require('express');
const { requireAuth } = require('../middleware/auth');
const Share = require('../models/Share');
const AccessLog = require('../models/AccessLog');

const router = express.Router();

const REASONS = ['revoked', 'expired', 'limit_reached', 'login_required', 'email_not_allowed', 'file_missing'];
const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function parseDate(value, endOfDay) {
  const date = new Date(DATE_ONLY.test(value) && endOfDay ? `${value}T23:59:59.999Z` : value);
  return Number.isNaN(date.getTime()) ? null : date;
}

// Builds the query + paging, or returns { error }
function buildQuery(req, base) {
  const { outcome, reason, q, from, to } = req.query;
  const filter = { ...base, owner: req.user._id };

  if (outcome) {
    if (!['allowed', 'denied'].includes(outcome)) return { error: 'outcome must be allowed or denied' };
    filter.outcome = outcome;
  }
  if (reason) {
    if (!REASONS.includes(reason)) return { error: `reason must be one of: ${REASONS.join(', ')}` };
    filter.reason = reason;
  }
  if (q) filter.email = { $regex: escapeRegex(String(q).trim()), $options: 'i' };
  if (from || to) {
    filter.createdAt = {};
    if (from) {
      const d = parseDate(String(from), false);
      if (!d) return { error: 'from is not a valid date' };
      filter.createdAt.$gte = d;
    }
    if (to) {
      const d = parseDate(String(to), true);
      if (!d) return { error: 'to is not a valid date' };
      filter.createdAt.$lte = d;
    }
  }

  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 50, 1), 200);
  return { filter, page, limit };
}

async function sendLogs(res, { filter, page, limit }) {
  const [total, logs] = await Promise.all([
    AccessLog.countDocuments(filter),
    AccessLog.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('file', 'originalName'),
  ]);

  res.json({
    page,
    limit,
    total,
    logs: logs.map((l) => ({
      at: l.createdAt,
      code: l.code,
      fileName: l.file ? l.file.originalName : null,
      outcome: l.outcome,
      reason: l.reason,
      email: l.email, // null = visitor was not logged in
      userId: l.user,
      ip: l.ip,
      userAgent: l.userAgent,
    })),
  });
}

router.get('/shares/:code/logs', requireAuth, async (req, res) => {
  const share = await Share.findOne({ code: req.params.code, owner: req.user._id });
  if (!share) return res.status(404).json({ error: 'Share not found' });

  const query = buildQuery(req, { share: share._id });
  if (query.error) return res.status(400).json({ error: query.error });
  await sendLogs(res, query);
});

router.get('/activity', requireAuth, async (req, res) => {
  const query = buildQuery(req, {});
  if (query.error) return res.status(400).json({ error: query.error });
  await sendLogs(res, query);
});

module.exports = router;