// FEATURE: Info about a share (shown on the recipient's page)
// GET /api/shares/:code        header: Authorization: Bearer <token>  (optional, needed for restricted shares)
// The file name/size are only revealed to people who are allowed to open the file.
const express = require('express');
const { optionalAuth } = require('../middleware/auth');
const Share = require('../models/Share');
const { getStatus } = require('../utils/status');

const router = express.Router();

router.get('/:code', optionalAuth, async (req, res) => {
  const share = await Share.findOne({ code: req.params.code }).populate('file');
  if (!share) return res.status(404).json({ error: 'Share not found' });

  const restricted = share.allowedEmails.length > 0;
  const isOwner = !!req.user && String(share.owner) === String(req.user._id);
  const accessAllowed = !restricted || isOwner || (!!req.user && share.allowedEmails.includes(req.user.email));

  res.json({
    fileName: accessAllowed ? (share.file ? share.file.originalName : 'Unknown') : null,
    size: accessAllowed ? (share.file ? share.file.size : 0) : null,
    expiresAt: share.expiresAt,
    status: getStatus(share),
    restricted,
    requiresLogin: restricted && !req.user,
    accessAllowed,
    maxDownloads: share.maxDownloads,
    remainingDownloads: share.maxDownloads == null ? null : Math.max(share.maxDownloads - share.downloadCount, 0),
  });
});

module.exports = router;