/** Bandhan Matrimony — Authentication routes mounted at /api/v1/auth. */

const crypto = require('crypto');
const express = require('express');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const { generateToken, requireAuth } = require('../middleware/authMiddleware');
const { User, Profile, sequelize } = require('../models');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const {
  DEMO_PROFILE_IDS,
  loadFrontendMockProfiles,
  mockUserIdForProfileId,
} = require('../utils/mockData');

const router = express.Router();
const isProduction = process.env.NODE_ENV === 'production';

const normalizeEmail = value => value?.trim().toLowerCase() || null;
const normalizeMobile = value => value?.replace(/\D/g, '') || null;

const userDto = (user, profile) => ({
  id: String(user.id),
  email: user.email,
  mobile: user.mobile,
  gender: user.gender,
  name: profile?.fullName || user.email?.split('@')[0] || 'Bandhan Member',
  photo: profile?.photoUrl || null,
  isEmailVerified: Boolean(user.isEmailVerified),
  isMobileVerified: Boolean(user.isMobileVerified),
  isApproved: Boolean(user.isApproved),
  profileComplete: Boolean(user.profileComplete),
});

router.post('/demo', async (req, res) => {
  if (isProduction || process.env.ENABLE_DEMO_AUTH === 'false') {
    return sendError(res, 404, 'ROUTE_NOT_FOUND', 'Route not found.');
  }

  try {
    const gender = req.body?.gender;
    if (!['Bride', 'Groom'].includes(gender)) {
      return sendError(res, 400, 'INVALID_DEMO_GENDER', 'Demo gender must be Bride or Groom.');
    }

    const fixtureProfileId = DEMO_PROFILE_IDS[gender];
    const fixtureProfiles = await loadFrontendMockProfiles();
    const fixture = fixtureProfiles.find(profile => profile.id === fixtureProfileId);
    if (!fixture) {
      return sendError(res, 500, 'MOCK_FIXTURE_MISSING', 'The requested development fixture is unavailable.');
    }

    let user;
    let profile;
    if (process.env.DEMO_AUTH_USE_DATABASE === 'true') {
      user = await User.findByPk(mockUserIdForProfileId(fixtureProfileId));
      if (!user) {
        return sendError(
          res,
          409,
          'MOCK_DATA_NOT_SEEDED',
          'Development profiles are not seeded. Run the guarded mock seed command first.',
        );
      }
      if (!user.isActive) return sendError(res, 403, 'ACCOUNT_INACTIVE', 'The demo account is inactive.');
      profile = await Profile.findOne({ where: { userId: user.id } });
      await user.update({ lastLoginAt: new Date() });
    } else {
      user = {
        id: mockUserIdForProfileId(fixtureProfileId),
        email: `mock.profile${fixtureProfileId}@bandhan.test`,
        mobile: null,
        gender,
        isEmailVerified: true,
        isMobileVerified: true,
        isApproved: true,
        profileComplete: true,
        isActive: true,
      };
      profile = { fullName: fixture.name, photoUrl: fixture.photo };
    }

    return sendSuccess(res, {
      token: generateToken(user),
      user: { ...userDto(user, profile), loginMethod: 'demo' },
    }, { message: `Signed in as the demo ${gender}.` });
  } catch (error) {
    console.error('Demo login error:', error);
    return sendError(res, 500, 'DEMO_LOGIN_FAILED', 'Demo sign in failed.');
  }
});

router.post('/register', async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const fullName = req.body?.fullName?.trim();
    const email = normalizeEmail(req.body?.email);
    const mobile = normalizeMobile(req.body?.mobile);
    const password = req.body?.password;
    const gender = req.body?.gender;

    if (!['Bride', 'Groom'].includes(gender)) {
      await transaction.rollback();
      return sendError(res, 400, 'INVALID_GENDER', 'Gender must be Bride or Groom.');
    }
    if (!email) {
      await transaction.rollback();
      return sendError(res, 400, 'EMAIL_REQUIRED', 'Email is required for password registration.');
    }
    if (typeof password !== 'string' || password.length < 8) {
      await transaction.rollback();
      return sendError(res, 400, 'WEAK_PASSWORD', 'Password must contain at least 8 characters.');
    }

    const existingEmail = await User.findOne({ where: { email }, transaction });
    if (existingEmail) {
      await transaction.rollback();
      return sendError(res, 409, 'EMAIL_ALREADY_REGISTERED', 'Email is already registered.');
    }
    if (mobile) {
      const existingMobile = await User.findOne({ where: { mobile }, transaction });
      if (existingMobile) {
        await transaction.rollback();
        return sendError(res, 409, 'MOBILE_ALREADY_REGISTERED', 'Mobile number is already registered.');
      }
    }

    const user = await User.create({
      id: uuidv4(),
      email,
      mobile,
      password: await bcrypt.hash(password, 12),
      gender,
      loginMethod: 'email',
      isEmailVerified: false,
      isMobileVerified: false,
      isApproved: false,
      profileComplete: false,
    }, { transaction });

    const profile = await Profile.create({
      id: uuidv4(),
      userId: user.id,
      fullName: fullName || email.split('@')[0],
    }, { transaction });

    await transaction.commit();
    return sendSuccess(res, { token: generateToken(user), user: userDto(user, profile) }, {
      status: 201,
      message: 'Account created. Verify your contact details to continue.',
    });
  } catch (error) {
    if (transaction && !transaction.finished) await transaction.rollback();
    console.error('Register error:', error);
    return sendError(res, 500, 'REGISTRATION_FAILED', 'Registration failed. Please try again.');
  }
});

router.post('/login', async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const password = req.body?.password;
    if (!email || !password) return sendError(res, 400, 'CREDENTIALS_REQUIRED', 'Email and password are required.');

    const user = await User.findOne({ where: { email } });
    if (!user) return sendError(res, 401, 'INVALID_CREDENTIALS', 'Email or password is incorrect.');
    if (!user.isActive) return sendError(res, 403, 'ACCOUNT_INACTIVE', 'This account is deactivated.');
    if (!user.password) return sendError(res, 401, 'USE_SOCIAL_LOGIN', 'Use the sign-in method associated with this account.');
    if (!await bcrypt.compare(password, user.password)) {
      return sendError(res, 401, 'INVALID_CREDENTIALS', 'Email or password is incorrect.');
    }

    await user.update({ lastLoginAt: new Date() });
    const profile = await Profile.findOne({ where: { userId: user.id } });
    return sendSuccess(res, { token: generateToken(user), user: userDto(user, profile) }, { message: 'Signed in successfully.' });
  } catch (error) {
    console.error('Login error:', error);
    return sendError(res, 500, 'LOGIN_FAILED', 'Sign in failed. Please try again.');
  }
});

const requestOtp = async (req, res) => {
  try {
    const mobile = normalizeMobile(req.body?.mobile);
    const gender = req.body?.gender;
    const fullName = req.body?.fullName?.trim();

    if (!mobile || !/^\d{10,15}$/.test(mobile)) {
      return sendError(res, 400, 'INVALID_MOBILE', 'Enter a valid mobile number.');
    }

    const msg91Key = process.env.MSG91_API_KEY;
    const templateId = process.env.MSG91_TEMPLATE_ID;
    if (isProduction && (!msg91Key || !templateId)) {
      return sendError(res, 503, 'OTP_PROVIDER_UNAVAILABLE', 'Mobile verification is temporarily unavailable.');
    }

    let user = await User.findOne({ where: { mobile } });
    if (!user && !['Bride', 'Groom'].includes(gender)) {
      return sendError(res, 400, 'GENDER_REQUIRED', 'Choose Bride or Groom for a new registration.');
    }
    if (user && !user.isActive) return sendError(res, 403, 'ACCOUNT_INACTIVE', 'This account is deactivated.');

    const otp = crypto.randomInt(100000, 1000000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    if (!user) {
      user = await User.create({
        id: uuidv4(), mobile, gender, loginMethod: 'mobile', otpCode: otp, otpExpiresAt,
        isEmailVerified: false, isMobileVerified: false, isApproved: false, profileComplete: false,
      });
      await Profile.create({ id: uuidv4(), userId: user.id, fullName: fullName || 'New Member' });
    } else {
      await user.update({ otpCode: otp, otpExpiresAt });
    }

    if (msg91Key && templateId) {
      try {
        await axios.post('https://control.msg91.com/api/v5/otp', {
          template_id: templateId,
          mobile: mobile.length === 10 ? `91${mobile}` : mobile,
          otp,
        }, {
          headers: { authkey: msg91Key, 'content-type': 'application/json' },
          timeout: 10000,
        });
      } catch (providerError) {
        console.error('OTP provider error:', providerError.message);
        if (isProduction) return sendError(res, 502, 'OTP_DELIVERY_FAILED', 'The verification code could not be delivered. Try again.');
      }
    }

    const data = { destination: `***${mobile.slice(-4)}`, expiresInSeconds: 600 };
    if (!isProduction) data.otp_dev = otp;
    return sendSuccess(res, data, { message: 'Verification code sent.' });
  } catch (error) {
    console.error('Request OTP error:', error);
    return sendError(res, 500, 'OTP_REQUEST_FAILED', 'Failed to request a verification code.');
  }
};

const verifyOtp = async (req, res) => {
  try {
    const mobile = normalizeMobile(req.body?.mobile);
    const otp = req.body?.otp?.trim();
    if (!mobile || !otp) return sendError(res, 400, 'OTP_REQUIRED', 'Mobile number and verification code are required.');

    const user = await User.findOne({ where: { mobile } });
    if (!user) return sendError(res, 404, 'ACCOUNT_NOT_FOUND', 'No account was found for this mobile number.');
    if (!user.isActive) return sendError(res, 403, 'ACCOUNT_INACTIVE', 'This account is deactivated.');
    if (!user.otpCode || user.otpCode !== otp) return sendError(res, 401, 'INVALID_OTP', 'The verification code is incorrect.');
    if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) return sendError(res, 401, 'OTP_EXPIRED', 'The verification code has expired.');

    await user.update({
      isMobileVerified: true,
      otpCode: null,
      otpExpiresAt: null,
      lastLoginAt: new Date(),
    });
    const profile = await Profile.findOne({ where: { userId: user.id } });
    const token = generateToken({ ...user.toJSON(), isMobileVerified: true });
    return sendSuccess(res, { token, user: userDto({ ...user.toJSON(), isMobileVerified: true }, profile) }, { message: 'Mobile number verified.' });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return sendError(res, 500, 'OTP_VERIFICATION_FAILED', 'Verification failed. Please try again.');
  }
};

router.post(['/send-otp', '/otp/request'], requestOtp);
router.post(['/verify-otp', '/otp/verify'], verifyOtp);

router.get('/google', (req, res, next) => {
  const gender = ['Bride', 'Groom'].includes(req.query.gender) ? req.query.gender : null;
  if (!gender) return sendError(res, 400, 'GENDER_REQUIRED', 'Choose Bride or Groom before Google sign in.');
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return sendError(res, 503, 'GOOGLE_AUTH_UNAVAILABLE', 'Google sign in is not configured.');
  }

  req.session.pendingGender = gender;
  return passport.authenticate('google', { scope: ['profile', 'email'], state: true })(req, res, next);
});

router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/?error=google_failed`,
    session: false,
  }),
  async (req, res) => {
    try {
      const user = req.user;
      const profile = await Profile.findOne({ where: { userId: user.id } });
      const callbackData = encodeURIComponent(JSON.stringify({
        ...userDto(user, profile),
        token: generateToken(user),
        loginMethod: 'google',
      }));
      // Use a URL fragment so the credential is not sent in subsequent HTTP requests or server logs.
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/#auth=${callbackData}`);
    } catch (error) {
      console.error('Google callback error:', error);
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/?error=google_server_error`);
    }
  });

router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId);
    if (!user || !user.isActive) return sendError(res, 404, 'ACCOUNT_NOT_FOUND', 'Account not found.');
    const profile = await Profile.findOne({ where: { userId: user.id } });
    return sendSuccess(res, userDto(user, profile));
  } catch (error) {
    console.error('Get current user error:', error);
    return sendError(res, 500, 'ACCOUNT_READ_FAILED', 'Failed to load your account.');
  }
});

router.post('/logout', (req, res) => {
  if (!req.session) return sendSuccess(res, null, { message: 'Signed out.' });
  return req.session.destroy(error => {
    if (error) return sendError(res, 500, 'LOGOUT_FAILED', 'Sign out failed.');
    return sendSuccess(res, null, { message: 'Signed out.' });
  });
});

module.exports = router;
