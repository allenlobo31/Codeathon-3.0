const mongoose = require('mongoose');

const shareSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    file: { type: mongoose.Schema.Types.ObjectId, ref: 'File', required: true },
    expiresAt: { type: Date, required: true },
    revokedAt: { type: Date, default: null },
    downloadCount: { type: Number, default: 0 },
    downloads: [{ at: Date, ip: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Share', shareSchema);