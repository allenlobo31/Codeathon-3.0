// FEATURE: "My Files" — list the files you uploaded
// GET /api/files?q=report     header: Authorization: Bearer <token>
const express = require('express');
const { requireAuth } = require('../middleware/auth');
const File = require('../models/File');
const Share = require('../models/Share');

const router = express.Router();

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

router.get('/', requireAuth, async (req, res) => {
  const q = String(req.query.q || '').trim();

  const filter = { owner: req.user._id };
  if (q) filter.originalName = { $regex: escapeRegex(q), $options: 'i' };

  const files = await File.find(filter).sort({ createdAt: -1 });

  // How many shares each file has
  const counts = await Share.aggregate([
    { $match: { owner: req.user._id, file: { $in: files.map((f) => f._id) } } },
    { $group: { _id: '$file', count: { $sum: 1 } } },
  ]);
  const shareCount = new Map(counts.map((c) => [String(c._id), c.count]));

  res.json(
    files.map((f) => ({
      id: f._id,
      originalName: f.originalName,
      size: f.size,
      mimeType: f.mimeType,
      createdAt: f.createdAt,
      shareCount: shareCount.get(String(f._id)) || 0,
    }))
  );
});

module.exports = router;