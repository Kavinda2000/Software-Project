import express from "express";
import User from "../models/User.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // Assuming vendors have a role field set to "vendor"
    const vendors = await User.find({ role: "vendor" }, "name email");
    res.json(vendors.map(v => ({ _id: v._id, name: v.name, email: v.email })));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch vendors" });
  }
});

export default router;