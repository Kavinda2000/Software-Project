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
    password: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: function () {
          return this.role === 'customer';  // Gender is only required for customers
    }},
    address: {
        type: String,
        required: function () {
          return this.role === 'vendor';  // Address is only required for vendors
        },
    },
    role: { 
        type: String, 
        enum: ["customer", "vendor"], 
        default: "customer" },

    resetToken: {
        type: String,},
    
    resetTokenExpiry: {
        type: Date,}
        
},
{
    timestamps: true,
})


const Employee = mongoose.model('User', userSchema);

export default Employee;

