import mongoose from "mongoose";

const RepairScheduleSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  email: { type: String, required: true },
  bikeModel: { type: String, required: true },
  repairDate: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  issueDescription: { type: String, required: true },
  contactNumber: { type: String, required: true },
  status: { type: String, default: "Scheduled" },
  paymentMethod: { type: String, default: "visa" },
  cardNumber: { type: String },
  expiry: { type: String },
  cvv: { type: String },
  paymentStatus: { type: String, default: "pending" }
}, { timestamps: true });

// ✅ Export default
const RepairSchedule = mongoose.model("RepairSchedule", RepairScheduleSchema);
export default RepairSchedule;
