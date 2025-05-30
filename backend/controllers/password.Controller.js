// controllers/password.controller.js
import User from '../models/User.js';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js'; // Create this helper

export const handleForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log('Forgot password request for:', email);
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(404).json({ message: 'User not found' });
    }
    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();
    const resetLink = `${process.env.BASE_URL}/reset-password?token=${token}&email=${email}`;
    console.log('Sending reset link:', resetLink);
    try {
      await sendEmail(email, 'Password Reset', `Click to reset password: ${resetLink}`);
    } catch (emailErr) {
      console.error('Error sending email:', emailErr);
      return res.status(500).json({ message: 'Failed to send email', error: emailErr.message });
    }
    res.json({ message: 'Password reset link sent to email' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};