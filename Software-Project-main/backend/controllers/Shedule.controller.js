import RepairSchedule from "../models/RepairSchedule.js";

export const createSchedule = async (req, res) => {
  const schedule = req.body;

  if (
    !schedule.customerName ||
    !schedule.bikeModel ||
    !schedule.repairDate ||
    !schedule.issueDescription ||
    !schedule.contactNumber
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all required fields" });
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
