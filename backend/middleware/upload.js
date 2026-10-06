const multer = require('multer');

// Keep the upload in memory; the upload feature then saves it into MongoDB.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
});

module.exports = { upload };