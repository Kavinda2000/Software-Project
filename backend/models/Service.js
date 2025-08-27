import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["bike repair", "bike service"], // only these two allowed
  },
  description: {
    type: String,
  },
  bookingPrice: {
    type: Number,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // or "Vendor" depending on your user model
    required: true,
  },
});

const Service = mongoose.model("Service", serviceSchema);
export default Service;
