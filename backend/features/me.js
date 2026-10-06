// FEATURE: Get the logged-in user (also a template for protected routes)
// GET /api/auth/me   header: Authorization: Bearer <token>
const express = require('express');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/me', requireAuth, (req, res) => {
  res.json({ id: req.user._id, name: req.user.name, email: req.user.email });
});

module.exports = router;