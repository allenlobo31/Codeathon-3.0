require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const signup = require('./features/signup');
const login = require('./features/login');
const me = require('./features/me');
const upload = require('./features/upload');
const myFiles = require('./features/myFiles');
const downloadFile = require('./features/downloadFile');
const createShare = require('./features/createShare');
const listShares = require('./features/listShares');
const shareInfo = require('./features/shareInfo');
const downloadShare = require('./features/downloadShare');
const revokeShare = require('./features/revokeShare');
const shareQr = require('./features/shareQr');
const accessLogs = require('./features/accessLogs');

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is missing in .env');
  process.exit(1);
}

const app = express();

// Allow the configured client plus any localhost / 127.0.0.1 port (Vite may move to 5174, 5175, ...)
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map((o) => o.trim());
app.use(
  cors({
    origin(origin, cb) {
      if (!origin || allowedOrigins.includes(origin) || /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
        return cb(null, true);
      }
      return cb(new Error(`Origin ${origin} not allowed by CORS`));
    },
  })
);
app.use(express.json());

app.use('/api/auth', signup);
app.use('/api/auth', login);
app.use('/api/auth', me);

app.use('/api/files', upload);
app.use('/api/files', myFiles);
app.use('/api/files', downloadFile);
app.use('/api/shares', createShare);
app.use('/api/shares', listShares);
app.use('/api/shares', shareQr);
app.use('/api/shares', shareInfo);
app.use('/api/shares', downloadShare);
app.use('/api/shares', revokeShare);

// Download tracking: GET /api/shares/:code/logs and GET /api/activity
app.use('/api', accessLogs);

// Error handler (e.g. file too large, DB errors)
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.code === 'LIMIT_FILE_SIZE' ? 413 : 500).json({ error: err.message });
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`)))
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });