import express from 'express';
import {
  createBikeServiceBooking,
  getBikeServiceBookings,
  getBikeServiceBookingById,
  updateBikeServiceBookingStatus,
  updatePaymentStatus,
  cancelBikeServiceBooking,
  getAvailableTimeSlots,
  getBookingStatistics,
  getCustomerBookings
} from '../controllers/bikeService.controller.js';

const router = express.Router();

// Create a new bike service booking
router.post('/bookings', createBikeServiceBooking);

// Get all bike service bookings (with optional filters)
router.get('/bookings', getBikeServiceBookings);

// Get customer bookings by email
router.get('/customer-bookings/:customerEmail', getCustomerBookings);

// Get a specific bike service booking by ID
router.get('/bookings/:id', getBikeServiceBookingById);

// Update bike service booking status
router.patch('/bookings/:id/status', updateBikeServiceBookingStatus);

// Update payment status
router.patch('/bookings/:id/payment', updatePaymentStatus);

// Cancel a bike service booking
router.patch('/bookings/:id/cancel', cancelBikeServiceBooking);

// Get available time slots for a specific date and service center
router.get('/available-slots', getAvailableTimeSlots);

// Get booking statistics
router.get('/statistics', getBookingStatistics);

export default router;
