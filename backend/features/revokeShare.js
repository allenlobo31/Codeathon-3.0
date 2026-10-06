// FEATURE: Revoke a share (link stops working immediately)
// PATCH /api/shares/:code/revoke
const express = require('express');
const Share = require('../models/Share');

const router = express.Router();

router.patch('/:code/revoke', async (req, res) => {
  const share = await Share.findOne({ code: req.params.code });
  if (!share) return res.status(404).json({ error: 'Share not found' });

  if (!share.revokedAt) {
    share.revokedAt = new Date();
    await share.save();
  }
  res.json({ code: share.code, status: 'revoked' });
});

module.exports = router;