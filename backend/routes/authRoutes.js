// const express  = require('express');
// const passport = require('../config/passport');
// const jwt      = require('jsonwebtoken');
// const router   = express.Router();

// const FRONTEND = process.env.FRONTEND_URL || 'http://localhost:3000';

// // FIX: Added back the missing '/google' route
// // This is what handles the initial click on the "Login with Google" button
// router.get('/google',
//   passport.authenticate('google', {
//     scope: ['profile', 'email'],
//     session: false,
//   })
// );

// // Step 2 — Google redirects back here
// router.get(
//   '/google/callback',
//   passport.authenticate('google', {
//     session: false,
//     failureRedirect: `${FRONTEND}/login?error=google_failed`,
//   }),
//   (req, res) => {
//     const user = req.user;

//     const token = jwt.sign(
//       { userId: user._id, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: '1d' }
//     );

//     const params = new URLSearchParams({
//       token,
//       id:      user._id.toString(),
//       name:    user.name,
//       email:   user.email,
//       avatar:  user.avatarUrl || '',
//       newUser: (!user.location?.coordinates?.some(c => c !== 0)).toString(),
//     });

//     res.redirect(`${FRONTEND}/auth/callback?${params.toString()}`);
//   }
// );

// module.exports = router;

// routes/authRoutes.js
const express  = require('express');
const passport = require('../config/passport');
const jwt      = require('jsonwebtoken');
const router   = express.Router();

// Strip trailing slash — FRONTEND_URL on Render must be: https://vigilantapp.vercel.app
const FRONTEND = (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/$/, '');

// Step 1 — redirect to Google
router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
    prompt: 'select_account',
  })
);

// Step 2 — Google redirects back here
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session:         false,
    failureRedirect: `${FRONTEND}/login?error=google_failed`,
  }),
  (req, res) => {
    try {
      const user = req.user;
      if (!user) return res.redirect(`${FRONTEND}/login?error=no_user`);

      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      // Is this a brand new user? (coordinates still at placeholder [0,0])
      const coords = user.location?.coordinates || [0, 0];
      const isNew  = coords[0] === 0 && coords[1] === 0;

      const params = new URLSearchParams({
        token,
        name:    user.name       || '',
        email:   user.email      || '',
        avatar:  user.avatarUrl  || '',
        newUser: String(isNew),
      });

      // ✅ Always redirect to PRODUCTION frontend (FRONTEND_URL env var)
      return res.redirect(`${FRONTEND}/auth/callback?${params.toString()}`);
    } catch (err) {
      console.error('Google callback error:', err);
      return res.redirect(`${FRONTEND}/login?error=server_error`);
    }
  }
);

module.exports = router;