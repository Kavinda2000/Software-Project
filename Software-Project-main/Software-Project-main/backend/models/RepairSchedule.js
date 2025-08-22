import mongoose from "mongoose";

const RepairScheduleSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  bikeModel: {
    type: String,
    required: true,
  },
  repairDate: {
    type: Date,
    required: true,
  },
  issueDescription: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "Scheduled",
  },
}, { timestamps: true });

export default mongoose.model("RepairSchedule", RepairScheduleSchema);
