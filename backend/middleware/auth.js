// Protects a route: request must carry  Authorization: Bearer <token>
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Returns { user } or { error }
async function authenticate(req) {
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  if (scheme !== 'Bearer' || !token) return { error: 'Login required' };

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return { error: 'Invalid or expired token' };
  }

  const user = await User.findById(payload.id);
  if (!user) return { error: 'User no longer exists' };
  return { user };
}

async function requireAuth(req, res, next) {
  const { user, error } = await authenticate(req);
  if (error) return res.status(401).json({ error });

  req.user = user; // available in the route as req.user
  next();
}

// Login is optional: no Authorization header = anonymous visitor (req.user stays unset).
// A header that is present but invalid is still rejected, so a bad/expired token is never silently ignored.
async function optionalAuth(req, res, next) {
  if (!req.headers.authorization) return next();

  const { user, error } = await authenticate(req);
  if (error) return res.status(401).json({ error });

  req.user = user;
  next();
}

module.exports = { requireAuth, optionalAuth };