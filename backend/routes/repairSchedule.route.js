// routes/repairSchedule.route.js
import express from "express";
import { createSchedule, getCustomerBookings, getAllBookings } from "../controllers/Shedule.controller.js";



const router = express.Router();

// Create a new schedule
router.post("/", createSchedule);

// Fetch bookings for a specific customer
router.get("/customer-bookings/:email", getCustomerBookings);

// Fetch all bookings for vendors
router.get("/vendor/:vendorEmail", getAllBookings);

export default router;
