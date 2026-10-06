// FEATURE: Download a file using a share code (and track the download)
// GET /api/shares/:code/download
const express = require('express');
const Share = require('../models/Share');
const { getStatus } = require('../utils/status');
const { openDownloadStream } = require('../utils/gridfs');

const router = express.Router();

router.get('/:code/download', async (req, res) => {
  const share = await Share.findOne({ code: req.params.code }).populate('file');
  if (!share) return res.status(404).json({ error: 'Share not found' });

  // Checked on every request, so revoke/expiry work instantly.
  const status = getStatus(share);
  if (status !== 'active') {
    return res.status(410).json({ error: `This link is ${status}` });
  }
  if (!share.file) return res.status(404).json({ error: 'File not found' });

  // Track the download (atomic update)
  await Share.updateOne(
    { _id: share._id },
    { $inc: { downloadCount: 1 }, $push: { downloads: { at: new Date(), ip: req.ip } } }
  );

  // Stream the file straight out of MongoDB
  res.attachment(share.file.originalName); // sets Content-Disposition and Content-Type
  res.set('Content-Length', share.file.size);

  const stream = openDownloadStream(share.file.gridfsId);
  stream.on('error', () => {
    if (!res.headersSent) res.status(404).json({ error: 'File data not found' });
    else res.destroy();
  });
  stream.pipe(res);
});

module.exports = router;