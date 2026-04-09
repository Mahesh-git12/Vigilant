// routes/authRoutes.js
// Mount in server.js: app.use('/auth', require('./routes/authRoutes'));

const express  = require('express');
const passport = require('../config/passport');
const jwt      = require('jsonwebtoken');
const router   = express.Router();

const FRONTEND = process.env.FRONTEND_URL || 'http://localhost:3000';

// Step 1 — redirect user to Google
router.get('/google/callback', (req, res, next) => {
    passport.authenticate('google', { 
        session: false, 
        failureRedirect: `${FRONTEND}/login?error=google_failed` 
    }, (err, user, info) => {
        if (err || !user) {
            console.error("Passport Auth Error:", err || "No user found");
            return res.redirect(`${FRONTEND}/login?error=auth_failed`);
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        const params = new URLSearchParams({
            token,
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            avatar: user.avatarUrl || '',
            newUser: (!user.location?.coordinates?.some(c => c !== 0)).toString(),
        });

        res.redirect(`${FRONTEND}/auth/callback?${params.toString()}`);
    })(req, res, next);
});

// Step 2 — Google redirects back here
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session:         false,
    failureRedirect: `${FRONTEND}/login?error=google_failed`,
  }),
  (req, res) => {
    // req.user is the Mongoose user doc set by passport strategy
    const user = req.user;

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Send token + basic info to frontend via URL params
    // Frontend reads these, stores in localStorage, then redirects to /home
    const params = new URLSearchParams({
      token,
      id:       user._id.toString(),
      name:     user.name,
      email:    user.email,
      avatar:   user.avatarUrl || '',
      newUser:  (!user.location?.coordinates?.some(c => c !== 0)).toString(),
    });

    res.redirect(`${FRONTEND}/auth/callback?${params.toString()}`);
  }
);

module.exports = router;