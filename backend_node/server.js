/**
 * Bandhan Matrimony — Node.js API
 * Node/Express is the authoritative backend. All current contracts live under /api/v1.
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
const { sequelize } = require('./models');
const { sendSuccess, sendError } = require('./utils/apiResponse');

const app = express();
const PORT = Number.parseInt(process.env.PORT || '3001', 10);
const isProduction = process.env.NODE_ENV === 'production';

app.disable('x-powered-by');
if (isProduction) app.set('trust proxy', 1);

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

const allowedOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || 'http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:3000')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origin is not allowed by CORS.'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Idempotency-Key'],
  credentials: true,
}));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { code: 'AUTH_RATE_LIMITED', message: 'Too many authentication requests. Please try again later.' },
  },
});

const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { code: 'RATE_LIMITED', message: 'Too many requests. Please try again shortly.' },
  },
});

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

const sessionSecret = process.env.SESSION_SECRET || (isProduction ? null : 'bandhan-development-session-secret');
if (!sessionSecret) {
  throw new Error('SESSION_SECRET is required in production.');
}

app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: isProduction,
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000,
  },
}));

const passport = require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

const databaseState = {
  ready: false,
  lastError: null,
};

const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    if (!isProduction && process.env.DB_SYNC === 'true') {
      await sequelize.sync();
      console.warn('Development DB_SYNC is enabled. Use migrations for deployed environments.');
    }
    databaseState.ready = true;
    databaseState.lastError = null;
    console.log('Database connection established.');
  } catch (error) {
    databaseState.ready = false;
    databaseState.lastError = error.message;
    console.error('Database initialization failed:', error.message);
  }
};

initializeDatabase();

const uploadsDirectory = path.resolve(__dirname, process.env.UPLOAD_DIR || 'uploads');
if (!fs.existsSync(uploadsDirectory)) fs.mkdirSync(uploadsDirectory, { recursive: true });
// Temporary legacy serving path. Private authorized media delivery replaces this in the privacy phase.
app.use('/uploads', express.static(uploadsDirectory, { fallthrough: false }));

app.get(['/api', '/api/health', '/api/v1/health'], (_req, res) => sendSuccess(res, {
  status: 'healthy',
  service: 'Bandhan Matrimony API',
  version: 'v1',
  timestamp: new Date().toISOString(),
}));

app.get(['/api/ready', '/api/v1/ready'], (_req, res) => {
  if (!databaseState.ready) {
    return sendError(res, 503, 'DATABASE_NOT_READY', 'The database connection is not ready.');
  }
  return sendSuccess(res, { status: 'ready', database: 'connected' });
});

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profiles');
const matchRoutes = require('./routes/matches');
const visitRoutes = require('./routes/visits');
const interestRoutes = require('./routes/interests');
const aiRoutes = require('./routes/ai');

const mountApiRoutes = basePath => {
  app.use(`${basePath}/auth`, authLimiter, authRoutes);
  app.use(`${basePath}/profiles`, generalLimiter, profileRoutes);
  app.use(`${basePath}/matches`, generalLimiter, matchRoutes);
  app.use(`${basePath}/visits`, generalLimiter, visitRoutes);
  app.use(`${basePath}/interests`, generalLimiter, interestRoutes);
  app.use(`${basePath}/ai`, generalLimiter, aiRoutes);
};

mountApiRoutes('/api/v1');
// Temporary aliases for the prototype's original paths. Remove after frontend migration.
mountApiRoutes('/api');

if (!isProduction) {
  app.get('/api/dev/schema-info', (_req, res) => sendSuccess(res, {
    message: 'Schema changes must be applied through versioned migrations.',
    database: process.env.DB_NAME || 'bandhan_db',
  }));
}

app.use((error, _req, res, _next) => {
  console.error('Server error:', error);
  if (error.name === 'MulterError') {
    return sendError(res, 400, 'UPLOAD_REJECTED', `File upload error: ${error.message}`);
  }
  if (error.message === 'Origin is not allowed by CORS.') {
    return sendError(res, 403, 'CORS_ORIGIN_DENIED', error.message);
  }
  if (error.message?.includes('Only JPEG')) {
    return sendError(res, 400, 'UNSUPPORTED_IMAGE_TYPE', error.message);
  }
  return sendError(res, 500, 'INTERNAL_ERROR', 'Internal server error.');
});

app.use((req, res) => sendError(
  res,
  404,
  'ROUTE_NOT_FOUND',
  `Route not found: ${req.method} ${req.path}`,
));

let httpServer = null;
const startServer = () => {
  if (httpServer) return httpServer;
  httpServer = app.listen(PORT, () => {
    console.log(`Bandhan Matrimony API v1 listening on port ${PORT} (${process.env.NODE_ENV || 'development'}).`);
  });
  return httpServer;
};

if (require.main === module) startServer();

module.exports = app;
module.exports.startServer = startServer;
module.exports.databaseState = databaseState;
