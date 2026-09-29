/**
 * Bandhan Matrimony — Authentication Routes
 * POST /api/auth/register      — Email/Password Signup
 * POST /api/auth/login         — Email/Password Login
 * POST /api/auth/send-otp      — Send Mobile OTP via MSG91
 * POST /api/auth/verify-otp    — Verify Mobile OTP & Login
 * GET  /api/auth/google        — Start Google OAuth
 * GET  /api/auth/google/callback — Google OAuth Callback
 * GET  /api/auth/me            — Get current user (protected)
 * POST /api/auth/logout        — Clear session
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const axios = require('axios');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const { generateToken, requireAuth } = require('../middleware/authMiddleware');
const { User, Profile } = require('../models');

// ─────────────────────────────────────────────
// POST /api/auth/register — Email Signup
// ─────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password, gender, mobile, profileCreatedBy } = req.body;

    if (!gender || !['Bride', 'Groom'].includes(gender)) {
      return res.status(400).json({ error: 'Gender must be Bride or Groom.' });
    }

    if (email) {
      const existing = await User.findOne({ where: { email } });
      if (existing) return res.status(409).json({ error: 'Email already registered.' });
    }

    if (mobile) {
      const existing = await User.findOne({ where: { mobile } });
      if (existing) return res.status(409).json({ error: 'Mobile number already registered.' });
    }

    const hashedPassword = password ? await bcrypt.hash(password, 12) : null;

    const user = await User.create({
      id: uuidv4(),
      email: email || null,
      mobile: mobile || null,
      password: hashedPassword,
      gender,
      loginMethod: email ? 'email' : 'mobile',
      isEmailVerified: false,
      isMobileVerified: false,
      isApproved: false,
      profileComplete: false,
    });

    // Create minimal profile record
    await Profile.create({
      id: uuidv4(),
      userId: user.id,
      fullName: fullName || email?.split('@')[0] || 'New User',
    });

    const token = generateToken(user);

    return res.status(201).json({
      message: 'Account created! Please verify your email/mobile.',
      token,
      user: {
        id: user.id,
        email: user.email,
        mobile: user.mobile,
        gender: user.gender,
        name: fullName,
        isEmailVerified: user.isEmailVerified,
        isMobileVerified: user.isMobileVerified,
        isApproved: user.isApproved,
        profileComplete: user.profileComplete,
      }
    });

  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// ─────────────────────────────────────────────
// POST /api/auth/login — Email Login
// ─────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'No account found with this email.' });
    if (!user.isActive) return res.status(403).json({ error: 'Account deactivated. Contact support.' });
    if (!user.password) return res.status(401).json({ error: 'Please login with Google.' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: 'Incorrect password.' });

    // Update last login
    await user.update({ lastLoginAt: new Date() });

    const profile = await Profile.findOne({ where: { userId: user.id } });
    const token = generateToken(user);

    return res.json({
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        email: user.email,
        gender: user.gender,
        name: profile?.fullName || email.split('@')[0],
        photo: profile?.photoUrl || null,
        isEmailVerified: user.isEmailVerified,
        isApproved: user.isApproved,
        profileComplete: user.profileComplete,
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// ─────────────────────────────────────────────
// POST /api/auth/send-otp — Send Mobile OTP
// ─────────────────────────────────────────────
router.post('/send-otp', async (req, res) => {
  try {
    const { mobile, gender, fullName } = req.body;

    if (!mobile || mobile.length < 10) {
      return res.status(400).json({ error: 'Valid 10-digit mobile number required.' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Find or create user
    let user = await User.findOne({ where: { mobile } });
    if (!user) {
      if (!gender) return res.status(400).json({ error: 'Gender required for new registration.' });
      user = await User.create({
        id: uuidv4(),
        mobile,
        gender,
        loginMethod: 'mobile',
        otpCode: otp,
        otpExpiresAt,
      });
      await Profile.create({ id: uuidv4(), userId: user.id, fullName: fullName || 'New User' });
    } else {
      await user.update({ otpCode: otp, otpExpiresAt });
    }

    // Send OTP via MSG91 API
    const msg91Key = process.env.MSG91_API_KEY;
    const templateId = process.env.MSG91_TEMPLATE_ID;
    
    if (msg91Key && templateId) {
      try {
        await axios.post('https://control.msg91.com/api/v5/otp', {
          template_id: templateId,
          mobile: `91${mobile}`,
          otp,
        }, {
          headers: { authkey: msg91Key, 'content-type': 'application/json' }
        });
      } catch (smsErr) {
        console.warn('MSG91 failed:', smsErr.message);
        // Continue — OTP stored in DB for dev
      }
    }

    // In development, return OTP in response for testing
    const response = { message: `OTP sent to +91 ${mobile}` };
    if (process.env.NODE_ENV === 'development') {
      response.otp_dev = otp; // Only in dev mode!
    }

    return res.json(response);

  } catch (err) {
    console.error('Send OTP error:', err);
    return res.status(500).json({ error: 'Failed to send OTP. Please try again.' });
  }
});

// ─────────────────────────────────────────────
// POST /api/auth/verify-otp — Verify Mobile OTP
// ─────────────────────────────────────────────
router.post('/verify-otp', async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({ error: 'Mobile and OTP are required.' });
    }

    const user = await User.findOne({ where: { mobile } });
    if (!user) return res.status(404).json({ error: 'No account found. Please register first.' });

    if (user.otpCode !== otp) {
      return res.status(401).json({ error: 'Incorrect OTP. Please try again.' });
    }

    if (user.otpExpiresAt < new Date()) {
      return res.status(401).json({ error: 'OTP expired. Please request a new OTP.' });
    }

    await user.update({
      isMobileVerified: true,
      otpCode: null,
      otpExpiresAt: null,
      lastLoginAt: new Date(),
    });

    const profile = await Profile.findOne({ where: { userId: user.id } });
    const token = generateToken({ ...user.toJSON(), isMobileVerified: true });

    return res.json({
      message: 'OTP verified! Account activated.',
      token,
      user: {
        id: user.id,
        mobile: user.mobile,
        gender: user.gender,
        name: profile?.fullName || 'User',
        photo: profile?.photoUrl || null,
        isEmailVerified: user.isEmailVerified,
        isMobileVerified: true,
        isApproved: user.isApproved,
        profileComplete: user.profileComplete,
      }
    });

  } catch (err) {
    console.error('Verify OTP error:', err);
    return res.status(500).json({ error: 'OTP verification failed.' });
  }
});

// ─────────────────────────────────────────────
// GET /api/auth/google — Start Google OAuth
// ─────────────────────────────────────────────
router.get('/google', (req, res, next) => {
  // Store gender intent from query param for signup
  if (req.query.gender) {
    req.session = req.session || {};
    req.session.pendingGender = req.query.gender;
  }
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: req.query.gender || 'Bride',
  })(req, res, next);
});

// ─────────────────────────────────────────────
// GET /api/auth/google/callback — Google OAuth Callback
// ─────────────────────────────────────────────
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_failed`, session: false }),
  async (req, res) => {
    try {
      const user = req.user;
      const token = generateToken(user);
      const profile = await Profile.findOne({ where: { userId: user.id } });

      // Redirect to frontend with token
      const userInfo = encodeURIComponent(JSON.stringify({
        id: user.id,
        name: profile?.fullName || user.email?.split('@')[0] || 'User',
        email: user.email,
        gender: user.gender,
        photo: profile?.photoUrl || null,
        isApproved: user.isApproved,
        profileComplete: user.profileComplete,
        token,
      }));

      res.redirect(`${process.env.FRONTEND_URL}?auth=${userInfo}`);
    } catch (err) {
      console.error('Google callback error:', err);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
    }
  }
);

// ─────────────────────────────────────────────
// GET /api/auth/me — Get Current User (Protected)
// ─────────────────────────────────────────────
router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      include: [{ model: Profile, as: 'profile' }]
    });

    if (!user) return res.status(404).json({ error: 'User not found.' });

    return res.json({
      id: user.id,
      email: user.email,
      mobile: user.mobile,
      gender: user.gender,
      name: user.profile?.fullName || 'User',
      photo: user.profile?.photoUrl || null,
      isEmailVerified: user.isEmailVerified,
      isMobileVerified: user.isMobileVerified,
      isApproved: user.isApproved,
      profileComplete: user.profileComplete,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to get user.' });
  }
});

module.exports = router;
