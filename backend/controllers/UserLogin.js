import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' }); // User not found
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect password' }); // Incorrect password
    }

    // Create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({
      success: true,
      message: 'Login successful', // Success message
      user: { email: user.email, name: user.name, role: user.role },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' }); // Server error
  }
};

