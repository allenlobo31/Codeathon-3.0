require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const upload = require('./features/upload');
const createShare = require('./features/createShare');
const listShares = require('./features/listShares');
const shareInfo = require('./features/shareInfo');
const downloadShare = require('./features/downloadShare');
const revokeShare = require('./features/revokeShare');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/files', upload);
app.use('/api/shares', createShare);
app.use('/api/shares', listShares);
app.use('/api/shares', shareInfo);
app.use('/api/shares', downloadShare);
app.use('/api/shares', revokeShare);

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