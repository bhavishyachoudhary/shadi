/**
 * Passport.js — Google OAuth 2.0 Strategy
 * Handles Google Sign-In for Bandhan Matrimony
 */

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { v4: uuidv4 } = require('uuid');
const { User, Profile } = require('../models');

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID || 'your_google_client_id',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'your_google_client_secret',
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3001/api/v1/auth/google/callback',
    passReqToCallback: true,
  },
  async (req, accessToken, refreshToken, googleProfile, done) => {
    try {
      const email = googleProfile.emails?.[0]?.value;
      const googleId = googleProfile.id;
      const displayName = googleProfile.displayName;
      const photo = googleProfile.photos?.[0]?.value;

      // Gender intent is stored server-side; the OAuth state parameter is reserved for CSRF protection.
      const gender = req.session?.pendingGender || 'Bride';
      if (req.session) delete req.session.pendingGender;

      // Check if user already exists
      let user = await User.findOne({
        where: { googleId }
      });

      if (!user && email) {
        // Check by email
        user = await User.findOne({ where: { email } });
        if (user) {
          // Link Google ID to existing email account
          await user.update({ googleId, loginMethod: 'google' });
        }
      }

      if (!user) {
        // New user — create account
        user = await User.create({
          id: uuidv4(),
          email: email || null,
          googleId,
          gender: ['Bride', 'Groom'].includes(gender) ? gender : 'Bride',
          loginMethod: 'google',
          isEmailVerified: !!email, // Google accounts are email-verified
          isMobileVerified: false,
          isApproved: false,
          profileComplete: false,
        });

        // Create minimal profile
        await Profile.create({
          id: uuidv4(),
          userId: user.id,
          fullName: displayName || email?.split('@')[0] || 'New User',
          photoUrl: photo || null,
        });
      } else {
        // Update last login
        await user.update({ lastLoginAt: new Date() });
      }

      return done(null, user);

    } catch (err) {
      console.error('Google OAuth error:', err);
      return done(err, null);
    }
  }
));

// Serialize/deserialize (for session — we use JWT so these are minimal)
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
