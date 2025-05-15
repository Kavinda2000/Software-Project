import User from "../models/User.js"
import bcrypt from "bcryptjs"

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, address, gender} = req.body;

    // Validate input
    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      gender,
      address,
      phone
    });

    await newUser.save();

    res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error });
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


