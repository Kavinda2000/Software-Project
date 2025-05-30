import User from "../models/User.js"
import bcrypt from 'bcryptjs';


export const registerUser = async (req, res) => {
  try {
    const { name, email, role, phone, address, gender, password } = req.body;

    if (!name || !email || !role || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }



    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Save user with hashedPassword
      const newUser = new User({
        name,
        email,
        phone,
        password: hashedPassword,
        role,
        gender,
        address
      });

    await newUser.save();

    res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error(error);  // <-- Check this output in your server console
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


export const userDetails = async (req, res) => {
  const { email } = req.query; // Get email from query parameters
  try {
    const user = await User.findOne({ email }); // Find user by email
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user); // Send user data as response
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


