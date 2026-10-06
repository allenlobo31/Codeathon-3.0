// FEATURE: Revoke a share (link stops working immediately) — only the sender can do this
// PATCH /api/shares/:code/revoke     header: Authorization: Bearer <token>
const express = require('express');
const { requireAuth } = require('../middleware/auth');
const Share = require('../models/Share');

const router = express.Router();

router.patch('/:code/revoke', requireAuth, async (req, res) => {
  // Not your share and no such share look the same on purpose
  const share = await Share.findOne({ code: req.params.code, owner: req.user._id });
  if (!share) return res.status(404).json({ error: 'Share not found' });

  if (!share.revokedAt) {
    share.revokedAt = new Date();
    await share.save();
  }
  res.json({ code: share.code, status: 'revoked', revokedAt: share.revokedAt });
});

module.exports = router;