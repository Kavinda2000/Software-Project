// routes/password.route.js
import express from 'express';
import { handleForgotPassword } from '../controllers/password.controller.js';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

const router = express.Router();

router.post('/forgot-password', handleForgotPassword);

router.post('/reset-password', async (req, res) => {
  const { email, token, newPassword } = req.body;
  try {
    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    // 2. Validate token and expiry
    if (!user.resetToken || user.resetToken !== token || !user.resetTokenExpiry || user.resetTokenExpiry < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired token.' });
    }

    // 3. Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 4. Update user password and remove reset token
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ message: 'Password reset successful!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
});


export default router;