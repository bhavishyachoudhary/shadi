/** Bandhan Matrimony — Bearer JWT authentication middleware. */

const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/apiResponse');

const isProduction = process.env.NODE_ENV === 'production';
const JWT_SECRET = process.env.JWT_SECRET || (isProduction ? null : 'bandhan-development-jwt-secret-change-me');

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is required in production.');
}

const extractBearerToken = req => {
  const authorization = req.headers.authorization;
  if (!authorization?.startsWith('Bearer ')) return null;
  return authorization.slice('Bearer '.length).trim() || null;
};

const requireAuth = (req, res, next) => {
  const token = extractBearerToken(req);
  if (!token) {
    return sendError(res, 401, 'AUTH_REQUIRED', 'Please sign in to continue.');
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 401, 'SESSION_EXPIRED', 'Your session has expired. Please sign in again.');
    }
    return sendError(res, 401, 'INVALID_TOKEN', 'Your session token is invalid. Please sign in again.');
  }
};

const optionalAuth = (req, _res, next) => {
  const token = extractBearerToken(req);
  if (!token) return next();

  try {
    req.user = jwt.verify(token, JWT_SECRET);
  } catch {
    req.user = null;
  }
  return next();
};

const generateToken = user => jwt.sign(
  {
    userId: String(user.id),
    email: user.email,
    mobile: user.mobile,
    gender: user.gender,
    isEmailVerified: Boolean(user.isEmailVerified),
    isMobileVerified: Boolean(user.isMobileVerified),
    isApproved: Boolean(user.isApproved),
    profileComplete: Boolean(user.profileComplete),
  },
  JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES_IN || '24h' },
);

module.exports = { requireAuth, optionalAuth, generateToken };
