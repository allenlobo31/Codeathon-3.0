// FEATURE: Download a file using a share code, enforce all rules, and log every attempt
// GET /api/shares/:code/download     header: Authorization: Bearer <token>  (needed for restricted shares)
//
// Checked on every request: revoked -> expired -> limit reached -> login -> email allowed.
// Allowed and denied attempts are both written to the access log (with the reason).
const express = require('express');
const { optionalAuth } = require('../middleware/auth');
const Share = require('../models/Share');
const { getStatus } = require('../utils/status');
const { openDownloadStream } = require('../utils/gridfs');
const { logAccess } = require('../utils/accessLog');

const router = express.Router();

const DEAD_STATUS_MESSAGE = {
  revoked: 'This link has been revoked',
  expired: 'This link has expired',
  limit_reached: 'The download limit for this link has been reached',
};

router.get('/:code/download', optionalAuth, async (req, res) => {
  if (!/^\d{6}$/.test(req.params.code)) {
    return res.status(400).json({ error: 'Share code must be 6 digits' });
  }
  const share = await Share.findOne({ code: req.params.code }).populate('file');
  if (!share) return res.status(404).json({ error: 'Share not found' });

  // 1. Is the link still alive?
  const status = getStatus(share);
  if (status !== 'active') {
    await logAccess(req, share, { outcome: 'denied', reason: status });
    return res.status(410).json({ error: DEAD_STATUS_MESSAGE[status], status });
  }

  // 2. Restricted share: must be logged in with a listed email
  if (share.allowedEmails.length > 0) {
    if (!req.user) {
      await logAccess(req, share, { outcome: 'denied', reason: 'login_required' });
      return res.status(401).json({ error: 'Login required to open this file' });
    }
    if (!share.allowedEmails.includes(req.user.email)) {
      await logAccess(req, share, { outcome: 'denied', reason: 'email_not_allowed' });
      return res.status(403).json({ error: 'Your email is not allowed to open this file' });
    }
  }

  if (!share.file) {
    await logAccess(req, share, { outcome: 'denied', reason: 'file_missing' });
    return res.status(404).json({ error: 'File not found' });
  }

  // 3. Claim one download atomically. The same conditions are re-checked inside the update,
  //    so a revoke, an expiry or the last allowed download can't be beaten by a parallel request.
  const claimed = await Share.findOneAndUpdate(
    {
      _id: share._id,
      revokedAt: null,
      expiresAt: { $gt: new Date() },
      $or: [{ maxDownloads: null }, { $expr: { $lt: ['$downloadCount', '$maxDownloads'] } }],
    },
    { $inc: { downloadCount: 1 } },
    { new: true }
  );

  if (!claimed) {
    const fresh = await Share.findById(share._id);
    const nowStatus = fresh ? getStatus(fresh) : 'revoked';
    await logAccess(req, share, { outcome: 'denied', reason: nowStatus });
    return res.status(410).json({ error: DEAD_STATUS_MESSAGE[nowStatus] || 'This link is no longer active', status: nowStatus });
  }

  await logAccess(req, share, { outcome: 'allowed' });

  // Stream the file straight out of MongoDB
  res.attachment(share.file.originalName); // sets Content-Disposition and Content-Type
  res.set('Content-Length', share.file.size);

  const stream = openDownloadStream(share.file.gridfsId);
  stream.on('error', () => {
    if (!res.headersSent) res.status(404).json({ error: 'File data not found' });
    else res.destroy();
  });
  stream.pipe(res);
});

module.exports = router;