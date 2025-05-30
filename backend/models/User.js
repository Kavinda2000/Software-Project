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
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["customer", "vendor"],
    default: "customer"
  },
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

export default User;
