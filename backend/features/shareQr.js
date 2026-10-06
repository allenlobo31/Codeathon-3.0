// FEATURE: QR code for a share link — only the sender can fetch it
// GET /api/shares/:code/qr                 -> { code, link, qr: "data:image/png;base64,..." }
// GET /api/shares/:code/qr?format=png      -> the PNG image itself
const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { buildShareLink, makeQrDataUrl, makeQrBuffer } = require('../utils/qr');
const Share = require('../models/Share');

const router = express.Router();

router.get('/:code/qr', requireAuth, async (req, res) => {
  const share = await Share.findOne({ code: req.params.code, owner: req.user._id });
  if (!share) return res.status(404).json({ error: 'Share not found' });

  const link = buildShareLink(share.code);

  if (req.query.format === 'png') {
    res.type('png').send(await makeQrBuffer(link));
    return;
  }
  res.json({ code: share.code, link, qr: await makeQrDataUrl(link) });
});

module.exports = router;