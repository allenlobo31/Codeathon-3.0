// Protects a route: request must carry  Authorization: Bearer <token>
const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function requireAuth(req, res, next) {
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Login required' });
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  const user = await User.findById(payload.id);
  if (!user) return res.status(401).json({ error: 'User no longer exists' });

  req.user = user; // available in the route as req.user
  next();
}

module.exports = { requireAuth };