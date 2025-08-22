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
      return this.role === 'customer';  // Gender is only required for customers
    },
  },
  address: {
    type: String,
    required: function () {
      return this.role === 'vendor';  // Address is only required for vendors
    },
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: undefined
    }
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["customer", "vendor"],
    default: "customer"
  },
  profilePicture: {
    type: String, // Will store URL or file path
    default: ''   // Empty by default, image upload is optional
  },
  resetToken: {
    type: String,
    default: undefined
  },
  resetTokenExpiry: {
    type: Date,
    default: undefined
  }
  
}, {
  timestamps: true,
});

// Enable geospatial queries on vendor locations
userSchema.index({ location: '2dsphere' });

const User = mongoose.model('User', userSchema);

export default User;


