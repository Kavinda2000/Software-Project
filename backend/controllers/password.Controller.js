import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js'; // Now configured to accept HTML
import dotenv from 'dotenv';
dotenv.config();




// Forgot Password Handler
export const handleForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log('Forgot password request for:', email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token and expiry
    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes

    await user.save();

    // Create reset link
    const resetLink = `${process.env.BASE_URL}/reset-password?token=${token}&email=${email}`;
    console.log('Sending reset link:', resetLink);

    // Format HTML email
   const message = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
    <h2 style="color: #333;"><strong>Bifix</strong> Password Reset Request</h2>
    <p style="font-size: 16px; color: #555;">
      Hello ${user.name || 'there'},
    </p>
    <p style="font-size: 16px; color: #555;">
      We received a request to reset your password for your ${user.name || 'Bifix'} account.
    </p>
    <p style="font-size: 16px; color: #555;">
      Click the button below to reset your password. This link is valid for 1 hour:
    </p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">
        Reset Password
      </a>
    </div>
    <p style="font-size: 14px; color: #999;">
      If you didn’t request this, you can safely ignore this email. Your password will remain unchanged.
    </p>
    <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
    <p style="font-size: 12px; color: #aaa;">
      &copy; ${new Date().getFullYear()} <strong>Bifix</strong>. All rights reserved.
    </p>
  </div>
`;



    try {
      await sendEmail(email, 'Password Reset Request', message);
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


// Reset Password Handler
export const handleResetPassword = async (req, res) => {
  const { email, token, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    if (!user.resetToken || user.resetToken !== token || !user.resetTokenExpiry || user.resetTokenExpiry < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired token.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    res.json({ message: 'Password reset successful!' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};