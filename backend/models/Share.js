const mongoose = require('mongoose');

const shareSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    file: { type: mongoose.Schema.Types.ObjectId, ref: 'File', required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, // the sender
    expiresAt: { type: Date, required: true },
    revokedAt: { type: Date, default: null },
    allowedEmails: { type: [String], default: [] }, // empty = anyone with the link; otherwise only these (logged-in) emails
    maxDownloads: { type: Number, default: null, min: 1 }, // null = unlimited
    downloadCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Share', shareSchema);