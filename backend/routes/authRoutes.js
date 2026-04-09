const express  = require('express');
const passport = require('../config/passport');
const jwt      = require('jsonwebtoken');
const router   = express.Router();

const FRONTEND = process.env.FRONTEND_URL || 'http://localhost:3000';

// FIX: Added back the missing '/google' route
// This is what handles the initial click on the "Login with Google" button
router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);

// Step 2 — Google redirects back here
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${FRONTEND}/login?error=google_failed`,
  }),
  (req, res) => {
    const user = req.user;

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const params = new URLSearchParams({
      token,
      id:      user._id.toString(),
      name:    user.name,
      email:   user.email,
      avatar:  user.avatarUrl || '',
      newUser: (!user.location?.coordinates?.some(c => c !== 0)).toString(),
    });

    res.redirect(`${FRONTEND}/auth/callback?${params.toString()}`);
  }
);

module.exports = router;