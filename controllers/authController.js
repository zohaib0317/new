const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const { ALL_ROLES } = require('../utils/roles');

// Nodemailer setup (configure with your email service)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Signup
const signup = async (req, res) => {
  try {
    let { name, email, password, role } = req.body;
    email = email.toLowerCase();
    // Validate required fields
    if (!name || !email || !password || !role) {
      return res
        .status(400)
        .json({ success: false, message: 'All fields are required' });
    }

    if (!ALL_ROLES.includes(role)) {
      return res.status(400).json({ success: false, message: `Invalid role` });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      role,
    });

    // // Generate JWT
    // const token = jwt.sign(
    //   { id: user.id, role: user.role },
    //   process.env.SECRET_ACCESS_TOKEN,
    //   { expiresIn: '1h' }
    // );

    // Remove password from response
    const { password: _, ...userData } = user.get();
    return res.status(201).json({
      success: true,
      user: userData,
      // token
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid credentials' });
    }

    // Update last login
    await user.update({ lastLogin: new Date() });
console.log("JWT Secret is:", process.env.SECRET_ACCESS_TOKEN);

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.SECRET_ACCESS_TOKEN,
      { expiresIn: '1h' }
    );

    // Remove password from response
    const { password: _, ...userData } = user.get();
    return res.status(200).json({ success: true, user: userData, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Forgot Password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: 'Email is required' });
    }

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    // Generate reset token
    const resetToken = uuidv4();
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour expiry

    // Save token and expiry to user
    await user.update({
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetTokenExpires,
    });

    // Send email with reset link
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Click this link to reset your password: ${resetUrl}\n\nThis link will expire in 1 hour.`,
    };

    await transporter.sendMail(mailOptions);
    return res
      .status(200)
      .json({ success: true, message: 'Password reset email sent' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Validate required fields
    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required',
      });
    }

    // Find user by reset token
    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Sequelize.Op.gt]: new Date() },
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid or expired token' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token
    await user.update({
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });

    return res
      .status(200)
      .json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  signup,
  login,
  forgotPassword,
  resetPassword,
};
