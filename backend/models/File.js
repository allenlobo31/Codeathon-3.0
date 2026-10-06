const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema(
  {
    originalName: { type: String, required: true },
    gridfsId: { type: mongoose.Schema.Types.ObjectId, required: true }, // file contents in GridFS
    size: { type: Number, required: true },
    mimeType: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('File', fileSchema);