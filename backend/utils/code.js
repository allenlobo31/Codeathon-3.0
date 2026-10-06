const crypto = require('crypto');

// 12-character unguessable share code (e.g. "k3J9xQ2mT8aB")
function generateCode() {
  return crypto.randomBytes(9).toString('base64url');
}

module.exports = { generateCode };
