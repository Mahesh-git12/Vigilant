// config/passport.js
// npm install passport passport-google-oauth20

const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:  process.env.GOOGLE_CALLBACK_URL || '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error('No email from Google'), null);

        let user = await User.findOne({ email });

        if (!user) {
          // New user via Google — create with placeholder location
          // They can update location from Profile page later
          user = new User({
            name:      profile.displayName || email.split('@')[0],
            email,
            password:  null,          // no password for OAuth users
            avatarUrl: profile.photos?.[0]?.value || '',
            location: {
              type:        'Point',
              coordinates: [0, 0],    // placeholder; updated on first login from frontend
            },
            emergencyContacts: [],
          });
          await user.save();
        } else {
          // Update avatar if changed
          const newAvatar = profile.photos?.[0]?.value || '';
          if (newAvatar && user.avatarUrl !== newAvatar) {
            user.avatarUrl = newAvatar;
            await user.save();
          }
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Not used for session — we use JWT; but passport requires these stubs
passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select('-password');
    done(null, user);
  } catch (e) {
    done(e, null);
  }
});

module.exports = passport;  