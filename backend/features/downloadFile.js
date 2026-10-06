// FEATURE: Download one of your own files (from "My Files")
// GET /api/files/:id/download     header: Authorization: Bearer <token>
const express = require('express');
const mongoose = require('mongoose');
const { requireAuth } = require('../middleware/auth');
const File = require('../models/File');
const { openDownloadStream } = require('../utils/gridfs');

const router = express.Router();

router.get('/:id/download', requireAuth, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ error: 'Invalid file id' });

  // Only the owner can download directly; anyone else gets the same 404
  const file = await File.findOne({ _id: req.params.id, owner: req.user._id });
  if (!file) return res.status(404).json({ error: 'File not found' });

  res.attachment(file.originalName);
  res.set('Content-Length', file.size);

  const stream = openDownloadStream(file.gridfsId);
  stream.on('error', () => {
    if (!res.headersSent) res.status(404).json({ error: 'File data not found' });
    else res.destroy();
  });
  stream.pipe(res);
});

module.exports = router;