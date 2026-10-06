// FEATURE: Public info about a share (shown on the recipient's page)
// GET /api/shares/:code
const express = require('express');
const Share = require('../models/Share');
const { getStatus } = require('../utils/status');

const router = express.Router();

router.get('/:code', async (req, res) => {
  const share = await Share.findOne({ code: req.params.code }).populate('file');
  if (!share) return res.status(404).json({ error: 'Share not found' });

  res.json({
    fileName: share.file ? share.file.originalName : 'Unknown',
    size: share.file ? share.file.size : 0,
    expiresAt: share.expiresAt,
    status: getStatus(share),
  });
});

module.exports = router;