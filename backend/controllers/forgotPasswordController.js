import userModel from "../models/userModel.js";
import { createTransport } from "nodemailer"
import crypto from "crypto"
import bcrypt from "bcrypt"
import validator from "validator"
import dotenv from "dotenv"
dotenv.config()

const RESET_TOKEN_TTL_MS = 30 * 60 * 1000;

const transporter = createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_PASSWORD,
  },
});

// Route to handle "forgot password" request
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ message: 'Valid email is required' });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpiry = new Date(Date.now() + RESET_TOKEN_TTL_MS);
    await user.save();

    const resetUrl = `${process.env.URL}/resetPassword?token=${resetToken}`;

    const mailOptions = {
      from: process.env.GMAIL_USERNAME,
      to: email,
      subject: "Reset Password",
      html: `<h1>Reset Password</h1><h2>Click on the link to reset your password (expires in 30 minutes)</h2><h3><a href="${resetUrl}">${resetUrl}</a></h3>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);

    return res.status(200).json({ message: 'A link to reset your password has been sent to your email.' });
  } catch (err) {
    console.error('forgotPassword error:', err);
    return res.status(500).json({ message: 'Failed to send reset email', error: err.message });
  }
};

// Route to handle password reset request
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: 'Token and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const user = await userModel.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() },
    });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    return res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('resetPassword error:', err);
    return res.status(500).json({ message: 'Failed to reset password', error: err.message });
  }
};

export { forgotPassword, resetPassword }
