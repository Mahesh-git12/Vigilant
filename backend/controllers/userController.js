// const crypto = require('crypto');
// const nodemailer = require('nodemailer');
// const User = require('../models/User');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const path = require('path');

// // Register User
// exports.registerUser = async (req, res) => {
//   try {
//     const { name, email, password, emergencyContacts, location } = req.body;

//     if (!name || !email || !password || !location ||
//         !Array.isArray(location.coordinates) ||
//         location.coordinates.length !== 2 ||
//         typeof location.coordinates[0] !== 'number' ||
//         typeof location.coordinates[1] !== 'number') {
//       return res.status(400).json({ message: 'All fields and valid location are required.' });
//     }

//     if (await User.findOne({ email })) {
//       return res.status(409).json({ message: 'User already exists with this email.' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = new User({
//       name,
//       email,
//       password: hashedPassword,
//       emergencyContacts,
//       location: {
//         type: 'Point',
//         coordinates: location.coordinates
//       }
//     });

//     await user.save();
//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };

// // Login User
// exports.loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user || !(await bcrypt.compare(password, user.password)))
//       return res.status(401).json({ message: 'Invalid credentials' });
//     const token = jwt.sign(
//       { userId: user._id, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: '1d' }
//     );
//     res.json({
//       token,
//       user: { id: user._id, name: user.name, email: user.email }
//     });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };

// // Get Emergency Contacts
// exports.getEmergencyContacts = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.userId);
//     if (!user) return res.status(404).json({ message: 'User not found' });
//     res.json({ emergencyContacts: user.emergencyContacts });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };

// // Update Emergency Contacts
// exports.updateEmergencyContacts = async (req, res) => {
//   try {
//     const { emergencyContacts } = req.body;
//     const user = await User.findByIdAndUpdate(
//       req.user.userId,
//       { emergencyContacts },
//       { new: true }
//     );
//     if (!user) return res.status(404).json({ message: 'User not found' });
//     res.json({ message: 'Emergency contacts updated!', emergencyContacts: user.emergencyContacts });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };

// // Get Profile
// exports.getProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.userId).select('-password');
//     if (!user) return res.status(404).json({ message: 'User not found' });
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };

// // Update Profile
// exports.updateProfile = async (req, res) => {
//   try {
//     const { name, email } = req.body;
//     if (!name || !email) return res.status(400).json({ message: 'Name and email required' });

//     const user = await User.findByIdAndUpdate(
//       req.user.userId,
//       { name, email },
//       { new: true }
//     ).select('-password');

//     if (!user) return res.status(404).json({ message: 'User not found' });

//     res.json({ message: 'Profile updated!', user });
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to update profile' });
//   }
// };

// // Upload Avatar
// exports.uploadAvatar = async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

//     const avatarUrl = `/uploads/avatars/${req.file.filename}`;
//     const user = await User.findByIdAndUpdate(
//       req.user.userId,
//       { avatarUrl },
//       { new: true }
//     );

//     if (!user) return res.status(404).json({ message: 'User not found' });

//     res.json({ message: 'Profile photo uploaded successfully', avatarUrl: user.avatarUrl });
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to upload avatar', error: err.message });
//   }
// };

// exports.forgotPassword = async (req, res) => {
//   const { email } = req.body;
//   const user = await User.findOne({ email });
//   if (!user) return res.status(404).json({ message: 'User not found' });

//   // Generate token
//   const token = crypto.randomBytes(32).toString('hex');
//   const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

//   // Save hashed token and expiration
//   user.resetPasswordToken = hashedToken;
//   user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
//   await user.save();

//   // Send email with raw token (not hashed)
//   const resetUrl = `${process.env.REACT_APP_CLIENT_URL}/reset-password/${token}`;
//   await sendResetPasswordEmail(user.email, resetUrl);
//   res.json({ message: 'Reset email sent' });
// };

// // Reset password
// exports.resetPassword = async (req, res) => {
//   const { token } = req.params;
//   const { password } = req.body;

//   const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

//   const user = await User.findOne({
//     resetPasswordToken: hashedToken,
//     resetPasswordExpires: { $gt: Date.now() },
//   });

//   if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

//   user.password = await bcrypt.hash(password, 10);
//   user.resetPasswordToken = undefined;
//   user.resetPasswordExpires = undefined;
//   await user.save();

//   res.json({ message: 'Password reset successful' });
// };

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, emergencyContacts, location } = req.body;

    if (!name || !email || !password || !location ||
        !Array.isArray(location.coordinates) ||
        location.coordinates.length !== 2 ||
        typeof location.coordinates[0] !== 'number' ||
        typeof location.coordinates[1] !== 'number') {
      return res.status(400).json({ message: 'All fields and valid location are required.' });
    }

    if (await User.findOne({ email })) {
      return res.status(409).json({ message: 'User already exists with this email.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      emergencyContacts,
      location: {
        type: 'Point',
        coordinates: location.coordinates // [longitude, latitude]
      }
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign(
      { userId: user._id, email: user.email }, // key: userId (not _id)
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getEmergencyContacts = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ emergencyContacts: user.emergencyContacts });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateEmergencyContacts = async (req, res) => {
  try {
    const { emergencyContacts } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { emergencyContacts },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Emergency contacts updated!', emergencyContacts: user.emergencyContacts });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.uploadAvatar = async (req, res) => {
  try {
    console.log('File info:', req.file);
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { avatarUrl },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'Profile photo uploaded successfully', avatarUrl: user.avatarUrl });
  } catch (err) {
    console.error('Avatar upload error:', err);
    res.status(500).json({ message: 'Failed to upload avatar', error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) return res.status(400).json({ message: 'Name and email required' });

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { name, email },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Profile updated!', user });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};


