import BikeServiceBooking from '../models/BikeServiceBooking.js';
import User from '../models/User.js';

// Create a new bike service booking
export const createBikeServiceBooking = async (req, res) => {
  try {
    const {
      customerEmail,
      customerName,
      bikeModel,
      serviceCenter,
      serviceCenterId,
      bookingDate,
      timeSlot,
      issueDescription,
      contactNumber,
      serviceType = 'bike-service'
    } = req.body;

    // Validate required fields
    if (!customerEmail || !customerName || !bikeModel || !serviceCenter || !serviceCenterId || !bookingDate || !timeSlot || !issueDescription || !contactNumber) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if service center exists and is a vendor
    const serviceCenterExists = await User.findOne({ _id: serviceCenterId, role: 'vendor' });
    if (!serviceCenterExists) {
      return res.status(404).json({ error: 'Service center not found' });
    }

    // Note: for Bike Service, we do not block duplicate time slots. Multiple
    // bookings can share the same time window.

    // Create new booking
    const newBooking = new BikeServiceBooking({
      customerEmail,
      customerName,
      bikeModel,
      serviceCenter,
      serviceCenterId,
      bookingDate: new Date(bookingDate),
      timeSlot,
      issueDescription,
      contactNumber,
      bookingCharge: 300,
      serviceType
    });

    const savedBooking = await newBooking.save();

    res.status(201).json({
      message: 'Bike service booking created successfully',
      booking: savedBooking
    });

  } catch (error) {
    console.error('Error creating bike service booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get bookings by customer email
export const getCustomerBookings = async (req, res) => {
  try {
    const { customerEmail } = req.params;

    const bookings = await BikeServiceBooking.find({ customerEmail })
      .populate('serviceCenterId', 'name email address phone')
      .sort({ bookingDate: 1, timeSlot: 1 });

    res.json({
      success: true,
      bookings
    });

  } catch (error) {
    console.error('Error fetching customer bookings:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
};

// Get all bike service bookings (with optional filters)
export const getBikeServiceBookings = async (req, res) => {
  try {
    const {
      serviceCenterId,
      status,
      customerName,
      startDate,
      endDate,
      page = 1,
      limit = 10
    } = req.query;

    const filter = {};

    // Apply filters
    if (serviceCenterId) filter.serviceCenterId = serviceCenterId;
    if (status) filter.status = status;
    if (customerName) {
      filter.customerName = { $regex: customerName, $options: 'i' };
    }
    if (startDate && endDate) {
      filter.bookingDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const skip = (page - 1) * limit;

    const bookings = await BikeServiceBooking.find(filter)
      .populate('serviceCenterId', 'name email address')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await BikeServiceBooking.countDocuments(filter);

    res.json({
      bookings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalBookings: total,
        hasNext: skip + bookings.length < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching bike service bookings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get a specific bike service booking by ID
export const getBikeServiceBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await BikeServiceBooking.findById(id)
      .populate('serviceCenterId', 'name email address location');

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(booking);

  } catch (error) {
    console.error('Error fetching bike service booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update bike service booking status
export const updateBikeServiceBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, totalServiceCost, finalAmount } = req.body;

    const booking = await BikeServiceBooking.findById(id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Update fields
    if (status) booking.status = status;
    if (notes) booking.notes = notes;
    if (totalServiceCost !== undefined) booking.totalServiceCost = totalServiceCost;
    if (finalAmount !== undefined) booking.finalAmount = finalAmount;

    booking.updatedAt = new Date();

    const updatedBooking = await booking.save();

    res.json({
      message: 'Booking status updated successfully',
      booking: updatedBooking
    });

  } catch (error) {
    console.error('Error updating bike service booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update payment status
export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    if (!paymentStatus || !['pending', 'paid', 'refunded'].includes(paymentStatus)) {
      return res.status(400).json({ error: 'Invalid payment status' });
    }

    const booking = await BikeServiceBooking.findById(id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    booking.paymentStatus = paymentStatus;
    booking.updatedAt = new Date();

    const updatedBooking = await booking.save();

    res.json({
      message: 'Payment status updated successfully',
      booking: updatedBooking
    });

  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Cancel a bike service booking
export const cancelBikeServiceBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await BikeServiceBooking.findById(id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ error: 'Booking is already cancelled' });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({ error: 'Cannot cancel a completed booking' });
    }

    booking.status = 'cancelled';
    booking.updatedAt = new Date();

    const updatedBooking = await booking.save();

    res.json({
      message: 'Booking cancelled successfully',
      booking: updatedBooking
    });

  } catch (error) {
    console.error('Error cancelling bike service booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get available time slots for a specific date and service center
export const getAvailableTimeSlots = async (req, res) => {
  try {
    const { serviceCenterId, date } = req.query;

    if (!serviceCenterId || !date) {
      return res.status(400).json({ error: 'Service center ID and date are required' });
    }

    // Check if service center exists
    const serviceCenterExists = await User.findOne({ _id: serviceCenterId, role: 'vendor' });
    if (!serviceCenterExists) {
      return res.status(404).json({ error: 'Service center not found' });
    }

    // Get all time slots
    const allTimeSlots = [
      "7:30am - 8:30am",
      "8:30am - 9:30am",
      "9:30am - 10:30am",
      "10:30am - 11:30am",
      "11:30am - 12:30pm",
      "12:30pm - 1:30pm",
      "1:30pm - 2:30pm",
      "2:30pm - 3:30pm",
      "3:30pm - 4:30pm"
    ];

    // For Bike Service, we expose all time slots regardless of existing bookings
    res.json({
      availableSlots: allTimeSlots,
      bookedSlots: [],
      totalSlots: allTimeSlots.length,
      availableCount: allTimeSlots.length
    });

  } catch (error) {
    console.error('Error fetching available time slots:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get booking statistics
export const getBookingStatistics = async (req, res) => {
  try {
    const { serviceCenterId, startDate, endDate } = req.query;

    const filter = {};
    if (serviceCenterId) filter.serviceCenterId = serviceCenterId;
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const stats = await BikeServiceBooking.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
          pendingBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          confirmedBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] }
          },
          completedBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          cancelledBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
          },
          totalRevenue: { $sum: '$finalAmount' },
          totalBookingCharges: { $sum: '$bookingCharge' }
        }
      }
    ]);

    res.json(stats[0] || {
      totalBookings: 0,
      pendingBookings: 0,
      confirmedBookings: 0,
      completedBookings: 0,
      cancelledBookings: 0,
      totalRevenue: 0,
      totalBookingCharges: 0
    });

  } catch (error) {
    console.error('Error fetching booking statistics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};