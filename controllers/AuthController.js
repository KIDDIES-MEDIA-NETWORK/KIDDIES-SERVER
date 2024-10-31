const User = require('../models/User.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');
require('dotenv').config();

// User Registration
exports.registerUser = async (req, res) => {
    try {
      const { email, password, username } = req.body;
      const userExists = await User.findOne({ email });
      
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User already exists' });
      }

      // Check if a user with the username already exists
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ success: false, message: 'Username has been taken' });
    }
  
      // Generate a 6-digit verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000);
  
      // Create the user with the verification code
      const user = await User.create({ 
        email, 
        password, 
        username, 
        emailVerificationCode: verificationCode,
        isEmailConfirmed: false
      });
  
      // Send the verification code to the user's email
      await sendEmail({
        email: user.email,
        subject: 'Confirmation Code',
        message: `Your email confirmation code is: ${verificationCode}`
      });
  
      res.status(201).json({ success: true, message: 'User registered. Check your email for the confirmation code.' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };


// User Login
exports.loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body; // Change 'email' to 'identifier' as it can be email or username

    // Check if the identifier is an email or username
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }]
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/resetPassword?token=${resetToken}`;

    await sendEmail({
      email: user.email,
      subject: 'Password Reset Request',
      message: `You requested a password reset. Please click the following link: ${resetUrl}`
    });

    res.status(200).json({ success: true, message: 'Email sent' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.query;
    const { newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Confirm Email
// Confirm Email with 6-digit code
exports.confirmEmail = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    // Find user by email and check if the code matches
    const user = await User.findOne({ email });

    if (!user || user.emailVerificationCode !== verificationCode) {
      return res.status(400).json({ success: false, message: 'Invalid verification code or email' });
    }

    // Update user to confirm email and remove the verification code
    user.isEmailConfirmed = true;
    user.emailVerificationCode = null;
    await user.save();

    res.status(200).json({ success: true, message: 'Email confirmed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
