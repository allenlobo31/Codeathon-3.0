// Tiny JSON-file "database" so you don't need MongoDB for this demo.
// Shape: { files: [], shares: [] }
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', 'data');
const FILE = path.join(DIR, 'db.json');

function read() {
  if (!fs.existsSync(FILE)) {
    fs.mkdirSync(DIR, { recursive: true });
    fs.writeFileSync(FILE, JSON.stringify({ files: [], shares: [] }));
  }
  return JSON.parse(fs.readFileSync(FILE, 'utf8'));
}

function write(db) {
  fs.writeFileSync(FILE, JSON.stringify(db, null, 2));
}

module.exports = { read, write };
