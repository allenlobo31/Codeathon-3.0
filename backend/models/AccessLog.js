// One row per download attempt on a share, allowed or denied.
const mongoose = require('mongoose');

const accessLogSchema = new mongoose.Schema(
  {
    share: { type: mongoose.Schema.Types.ObjectId, ref: 'Share', required: true, index: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, // owner of the share
    file: { type: mongoose.Schema.Types.ObjectId, ref: 'File', default: null },
    code: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // null = not logged in
    email: { type: String, default: null },
    ip: String,
    userAgent: String,
    action: { type: String, enum: ['download', 'view'], default: 'download' },
    outcome: { type: String, enum: ['allowed', 'denied'], required: true },
    // set when denied: revoked | expired | limit_reached | login_required | email_not_allowed | file_missing
    reason: { type: String, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

module.exports = mongoose.model('AccessLog', accessLogSchema);