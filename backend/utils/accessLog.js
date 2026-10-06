const AccessLog = require('../models/AccessLog');

// Record a download attempt. Never throws: a logging problem must not break the download itself.
async function logAccess(req, share, { outcome, reason = null, action = 'download' }) {
  try {
    await AccessLog.create({
      share: share._id,
      owner: share.owner,
      file: share.file && share.file._id ? share.file._id : share.file || null,
      code: share.code,
      user: req.user ? req.user._id : null,
      email: req.user ? req.user.email : null,
      ip: req.ip,
      userAgent: String(req.get('user-agent') || '').slice(0, 300),
      action,
      outcome,
      reason,
    });
  } catch (err) {
    console.error('Access log failed:', err.message);
  }
}

module.exports = { logAccess };