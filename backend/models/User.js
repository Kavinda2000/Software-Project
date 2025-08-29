import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
  },
  gender: {
    type: String,
    required: function () {
      return this.role === "customer"; // Gender is only required for customers
    },
  },
  address: {
    type: String,
    required: function () {
      return this.role === "vendor"; // Address is only required for vendors
    },
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: undefined,   // allow completely undefined
    },
    coordinates: {
      type: [Number],       // [longitude, latitude]
      default: undefined,   // no default, only set if vendor has coordinates
    },
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["customer", "vendor"],
    default: "customer",
  },
  profilePicture: {
    type: String, // Will store URL or file path
    default: "",  // Empty by default, image upload is optional
  },
  resetToken: {
    type: String,
    default: undefined,
  },
  resetTokenExpiry: {
    type: Date,
    default: undefined,
  },
}, {
  timestamps: true,
});

// Enable geospatial queries only if vendor has a location
userSchema.index({ location: "2dsphere" });

const User = mongoose.model("User", userSchema);

export default User;
