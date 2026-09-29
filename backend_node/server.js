/**
 * Bandhan Matrimony — Node.js Express Server v2.0
 * Full Backend API for GoDaddy Shared Hosting
 * 
 * Features:
 *  - JWT Authentication (Email, Mobile OTP, Google OAuth)
 *  - MySQL via Sequelize ORM
 *  - Gemini AI Match Scoring (15 Dimensions)
 *  - Smart Chat Ice-Breakers
 *  - Profile Photo Uploads (Multer)
 *  - Rate Limiting & Security Headers (Helmet)
 *  - CORS for React Frontend
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// ═══════════════════════════════════════════════
//  SECURITY MIDDLEWARE
// ═══════════════════════════════════════════════
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' } // Allow serving images
}));

// CORS — allow React frontend
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:3000',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Rate Limiting — protect auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Max 20 auth requests per window
  message: { error: 'Too many requests. Please try again in 15 minutes.' }
});

const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  message: { error: 'Rate limit exceeded.' }
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Session (needed for Passport OAuth)
app.use(session({
  secret: process.env.SESSION_SECRET || 'bandhan_session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// ═══════════════════════════════════════════════
//  PASSPORT (Google OAuth)
// ═══════════════════════════════════════════════
const passport = require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

// ═══════════════════════════════════════════════
//  DATABASE SYNC
// ═══════════════════════════════════════════════
const { sequelize } = require('./models');

const syncDB = async () => {
  try {
    // alter:true — updates schema without dropping data (safe for production)
    await sequelize.sync({ alter: process.env.NODE_ENV !== 'production' });
    console.log('✅ Database schema synchronized.');
  } catch (err) {
    console.error('❌ Database sync failed:', err.message);
    // Don't crash — server can still handle requests
  }
};

syncDB();

// ═══════════════════════════════════════════════
//  STATIC FILES (Uploaded Photos)
// ═══════════════════════════════════════════════
const uploadsDir = process.env.UPLOAD_DIR || path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

// ═══════════════════════════════════════════════
//  API ROUTES
// ═══════════════════════════════════════════════

// Health Check
app.get(['/api', '/api/health'], (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Bandhan Matrimony API v2.0',
    timestamp: new Date().toISOString(),
    platform: 'GoDaddy cPanel Node.js',
    features: ['JWT Auth', 'Google OAuth', 'Mobile OTP', 'Gemini AI', 'MySQL'],
  });
});

// Auth Routes (rate limited)
const authRoutes = require('./routes/auth');
app.use('/api/auth', authLimiter, authRoutes);

// Profiles & Match Routes
const profileRoutes = require('./routes/profiles');
app.use('/api/profiles', generalLimiter, profileRoutes);
app.use('/api/matches', generalLimiter, profileRoutes); // reuse same router
app.use('/api/visits', generalLimiter, profileRoutes);
app.use('/api/interests', generalLimiter, profileRoutes);

// AI Routes (Gemini)
const aiRoutes = require('./routes/ai');
app.use('/api/ai', generalLimiter, aiRoutes);

// ═══════════════════════════════════════════════
//  MYSQL SCHEMA SQL — Export for GoDaddy phpMyAdmin
// ═══════════════════════════════════════════════
app.get('/api/admin/schema', (req, res) => {
  const schemaSql = `
-- Bandhan Matrimony Database Schema
-- Import via: GoDaddy cPanel → phpMyAdmin → Import

CREATE DATABASE IF NOT EXISTS bandhan_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bandhan_db;

-- (Sequelize auto-creates tables via sync — this is for manual reference)
  `;
  res.type('text/plain').send(schemaSql);
});

// ═══════════════════════════════════════════════
//  ERROR HANDLER
// ═══════════════════════════════════════════════
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  if (err.name === 'MulterError') {
    return res.status(400).json({ error: `File upload error: ${err.message}` });
  }
  return res.status(500).json({ error: 'Internal server error.' });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
});

// ═══════════════════════════════════════════════
//  START SERVER
// ═══════════════════════════════════════════════
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════╗
║   🌺 Bandhan Matrimony API v2.0 Running 🌺   ║
║   Port: ${PORT}                                  ║
║   Mode: ${process.env.NODE_ENV || 'development'}                       ║
║   Features: JWT + Google OAuth + Gemini AI   ║
╚═══════════════════════════════════════════════╝
  `);
});

module.exports = app;
