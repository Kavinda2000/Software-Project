import mongoose from 'mongoose';

const bikeServiceBookingSchema = new mongoose.Schema({
  customerEmail: {
    type: String,
    required: true,
    trim: true
  },
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  serviceType: {
    type: String,
    enum: ['bike-service', 'bike-repair'],
    default: 'bike-service'
  },
  bikeModel: {
    type: String,
    required: true,
    trim: true
  },
  serviceCenter: {
    type: String,
    required: true,
    trim: true
  },
  serviceCenterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookingDate: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: String,
    required: true,
    enum: [
      "7:30am - 8:30am",
      "8:30am - 9:30am", 
      "9:30am - 10:30am",
      "10:30am - 11:30am",
      "11:30am - 12:30pm",
      "12:30pm - 1:30pm",
      "1:30pm - 2:30pm",
      "2:30pm - 3:30pm",
      "3:30pm - 4:30pm"
    ]
  },
  issueDescription: {
    type: String,
    required: true,
    trim: true
  },
  contactNumber: {
    type: String,
    required: true,
    trim: true
  },
  bookingCharge: {
    type: Number,
    default: 300
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  totalServiceCost: {
    type: Number,
    default: 0
  },
  finalAmount: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
bikeServiceBookingSchema.index({ serviceCenterId: 1, bookingDate: 1, timeSlot: 1 });
bikeServiceBookingSchema.index({ status: 1 });
bikeServiceBookingSchema.index({ customerName: 1 });

const BikeServiceBooking = mongoose.model('BikeServiceBooking', bikeServiceBookingSchema);

export default BikeServiceBooking;
