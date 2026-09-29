/**
 * Bandhan Matrimony — JWT Auth Middleware
 * Verifies Bearer token on protected routes
 */

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'bandhan_default_secret';

/**
 * Middleware: Require valid JWT token
 * Attaches decoded user to req.user
 */
const requireAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided. Please login.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Session expired. Please login again.' });
    }
    return res.status(401).json({ error: 'Invalid token. Please login.' });
  }
};

/**
 * Middleware: Optional auth — attaches user if token exists, doesn't block if missing
 */
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      req.user = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      req.user = null;
    }
  }
  next();
};

/**
 * Helper: Generate JWT token for user
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      mobile: user.mobile,
      gender: user.gender,
      isEmailVerified: user.isEmailVerified,
      isMobileVerified: user.isMobileVerified,
      isApproved: user.isApproved,
      profileComplete: user.profileComplete,
    },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

module.exports = { requireAuth, optionalAuth, generateToken };
