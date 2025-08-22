import User from "../models/User.js"
import bcrypt from 'bcryptjs';


export const registerUser = async (req, res) => {
  try {
    const { name, email, role, phone, address, gender, password, latitude, longitude } = req.body;

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

    // If vendor provided coordinates, store as GeoJSON Point
    if (role === 'vendor' && typeof latitude === 'number' && typeof longitude === 'number') {
      newUser.location = { type: 'Point', coordinates: [Number(longitude), Number(latitude)] };
    }

    // If vendor did not provide coordinates but provided address, attempt geocoding
    if (role === 'vendor' && !newUser.location && address) {
      try {
        // Prefer native fetch if available
        const q = encodeURIComponent(address);
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${q}`;
        const resp = await fetch(url, {
          headers: {
            'User-Agent': 'bifix-app/1.0 (contact: admin@example.com)'
          }
        });
        if (resp && resp.ok) {
          const data = await resp.json();
          if (Array.isArray(data) && data.length > 0) {
            const best = data[0];
            const lat = Number(best.lat);
            const lon = Number(best.lon);
            if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
              newUser.location = { type: 'Point', coordinates: [lon, lat] };
            }
          }
        }
      } catch (e) {
        // Silent fail; registration proceeds without location
      }
    }

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


// Update user by email
export const updateUser = async (req, res) => {
  const { email } = req.params;
  const updates = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate({ email }, updates, {
      new: true, // return the updated document
    });

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
