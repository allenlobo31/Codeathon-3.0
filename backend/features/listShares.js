// FEATURE: Share history with status, search and filter
// GET /api/shares?q=report&status=active|expired|revoked
const express = require('express');
const Share = require('../models/Share');
const { getStatus } = require('../utils/status');

const router = express.Router();

router.get('/', async (req, res) => {
  const { q = '', status = '' } = req.query;

  const shares = await Share.find().populate('file').sort({ createdAt: -1 });

  const list = shares
    .map((share) => ({
      code: share.code,
      fileName: share.file ? share.file.originalName : 'Deleted file',
      size: share.file ? share.file.size : 0,
      createdAt: share.createdAt,
      expiresAt: share.expiresAt,
      downloadCount: share.downloadCount,
      status: getStatus(share),
    }))
    .filter((s) => s.fileName.toLowerCase().includes(String(q).toLowerCase()))
    .filter((s) => !status || s.status === status);

  res.json(list);
});

module.exports = router;