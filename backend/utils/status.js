// Status is calculated every time, never stored, so it can never be stale.
function getStatus(share) {
  if (share.revokedAt) return 'revoked';
  if (new Date(share.expiresAt) < new Date()) return 'expired';
  return 'active';
}

module.exports = { getStatus };
