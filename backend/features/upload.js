// FEATURE: Upload a file (contents are stored in MongoDB GridFS) — login required
// POST /api/files   (multipart/form-data, field name: "file")   header: Authorization: Bearer <token>
const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const { saveBuffer } = require('../utils/gridfs');
const File = require('../models/File');

const router = express.Router();

// requireAuth runs before multer, so anonymous requests are rejected before any file is buffered
router.post('/', requireAuth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const gridfsId = await saveBuffer(req.file.buffer, req.file.originalname, req.file.mimetype);

  const file = await File.create({
    owner: req.user._id,
    originalName: req.file.originalname,
    gridfsId,
    size: req.file.size,
    mimeType: req.file.mimetype,
  });

  res.status(201).json({
    id: file._id,
    originalName: file.originalName,
    size: file.size,
    mimeType: file.mimeType,
    createdAt: file.createdAt,
  });
});

module.exports = router;