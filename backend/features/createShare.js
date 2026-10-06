// FEATURE: Create a share link/code with an expiry time
// POST /api/shares   body: { fileId, expiresInMinutes }
const express = require('express');
const mongoose = require('mongoose');
const { generateCode } = require('../utils/code');
const File = require('../models/File');
const Share = require('../models/Share');

const router = express.Router();

router.post('/', async (req, res) => {
  const { fileId, expiresInMinutes } = req.body || {};
  const minutes = Number(expiresInMinutes);

  if (!fileId || !mongoose.isValidObjectId(fileId)) {
    return res.status(400).json({ error: 'A valid fileId is required' });
  }
  if (!minutes || minutes <= 0) {
    return res.status(400).json({ error: 'expiresInMinutes must be a positive number' });
  }

  const file = await File.findById(fileId);
  if (!file) return res.status(404).json({ error: 'File not found' });

  const share = await Share.create({
    code: generateCode(),
    file: file._id,
    expiresAt: new Date(Date.now() + minutes * 60 * 1000),
  });

  res.status(201).json({ code: share.code, expiresAt: share.expiresAt });
});

module.exports = router;