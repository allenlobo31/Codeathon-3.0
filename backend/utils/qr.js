const QRCode = require('qrcode');

// The link a recipient opens (matches the frontend route /s/<code>)
function buildShareLink(code) {
  const base = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '');
  return `${base}/s/${code}`;
}

// PNG as a data URL ("data:image/png;base64,...") ready for an <img src>
function makeQrDataUrl(text) {
  return QRCode.toDataURL(text, { margin: 1, width: 300 });
}

// Raw PNG bytes
function makeQrBuffer(text) {
  return QRCode.toBuffer(text, { margin: 1, width: 300 });
}

module.exports = { buildShareLink, makeQrDataUrl, makeQrBuffer };