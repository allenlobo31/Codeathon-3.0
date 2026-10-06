// Status is calculated every time, never stored, so it can never be stale.
// Returns: 'revoked' | 'expired' | 'limit_reached' | 'active'
function getStatus(share, now = new Date()) {
  if (share.revokedAt) return 'revoked';
  if (new Date(share.expiresAt) <= now) return 'expired';
  if (share.maxDownloads != null && share.downloadCount >= share.maxDownloads) return 'limit_reached';
  return 'active';
}

module.exports = { getStatus };