const crypto = require('crypto');

// Six-digit share code.
function generateCode() {
  return String(crypto.randomInt(100000, 1000000));
}

module.exports = { generateCode };
