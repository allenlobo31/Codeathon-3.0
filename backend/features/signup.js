// FEATURE: Sign up
// POST /api/auth/signup   body: { name, email, password, confirmPassword }
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { signToken } = require('../utils/token');

const router = express.Router();
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/signup', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body || {};

  // typeof check also blocks NoSQL-injection payloads like { "$gt": "" }
  if ([name, email, password, confirmPassword].some((v) => typeof v !== 'string')) {
    return res.status(400).json({ error: 'name, email, password and confirmPassword are required' });
  }

  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();

  if (cleanName.length < 2 || cleanName.length > 50) {
    return res.status(400).json({ error: 'Name must be 2-50 characters' });
  }
  if (!EMAIL_RE.test(cleanEmail)) {
    return res.status(400).json({ error: 'Enter a valid email' });
  }
  if (password.length < 8 || password.length > 64) {
    return res.status(400).json({ error: 'Password must be 8-64 characters' });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  if (await User.findOne({ email: cleanEmail })) {
    return res.status(409).json({ error: 'This email is already registered' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({ name: cleanName, email: cleanEmail, passwordHash });
    res.status(201).json({
      token: signToken(user),
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    if (err.code === 11000) {
      const duplicateField = Object.keys(err.keyPattern || err.keyValue || {})[0];
      if (duplicateField === 'email') {
        return res.status(409).json({ error: 'This email is already registered' });
      }
      return res.status(409).json({ error: 'This account could not be created because of a duplicate field' });
    }
    throw err;
  }
});

module.exports = router;