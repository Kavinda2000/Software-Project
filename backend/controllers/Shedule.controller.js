import RepairSchedule from "../models/bikerepair.js";

// Create a booking
export const createSchedule = async (req, res) => {
  const schedule = req.body;

  const requiredFields = [
    "customerName",
    "email",
    "bikeModel",
    "repairDate",
    "timeSlot",
    "issueDescription",
    "contactNumber"
  ];

  const missingFields = requiredFields.filter(field => !schedule[field]);
  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Missing required fields: ${missingFields.join(", ")}`
    });
  }

  try {
    const newSchedule = new RepairSchedule(schedule);
    await newSchedule.save();
    res.status(201).json({ success: true, data: newSchedule });
  } catch (error) {
    console.error("Error in creating schedule:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get bookings for a specific customer
export const getCustomerBookings = async (req, res) => {
  const { email } = req.params;
  try {
    const bookings = await RepairSchedule.find({ email }).sort({ repairDate: 1 });
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get all bookings (for vendor view)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await RepairSchedule.find().sort({ repairDate: 1 });
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
