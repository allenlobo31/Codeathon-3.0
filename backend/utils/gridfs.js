// Stores file contents inside MongoDB (GridFS), not on the server's disk.
const mongoose = require('mongoose');
const { Readable } = require('stream');

function getBucket() {
  return new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'files' });
}

// Save an in-memory buffer into MongoDB, resolves with the GridFS file id
function saveBuffer(buffer, filename, contentType) {
  return new Promise((resolve, reject) => {
    const uploadStream = getBucket().openUploadStream(filename, { contentType });
    Readable.from(buffer)
      .pipe(uploadStream)
      .on('error', reject)
      .on('finish', () => resolve(uploadStream.id));
  });
}

function openDownloadStream(gridfsId) {
  return getBucket().openDownloadStream(gridfsId);
}

module.exports = { saveBuffer, openDownloadStream };