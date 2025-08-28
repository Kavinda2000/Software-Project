import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Bike Repair/BikeRepairSchedule.css";
import SuccessPopup from "./components/SuccessPopup";

function BikeServicePayment() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("visa");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [serviceDate, setServiceDate] = useState(state?.date || "");
  
  // Debug: Log the state to see what's available
  console.log('Payment component state:', state);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  if (!state) {
    return (
      <div className="bike-repair-schedule-background">
        <div className="bike-repair-schedule-container">
          <p>Missing booking details. Please start again.</p>
          <button className="btn" onClick={() => navigate("/Services/BikeServiceSchedule")}>Back to Booking</button>
        </div>
      </div>
    );
  }

  const submitPayment = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    try {

      // Get user data for customer email
      const userData = JSON.parse(sessionStorage.getItem('userData'));
      if (!userData?.email) {
        throw new Error("User not logged in. Please log in again.");
      }

      // Debug: Log the state data
      console.log('Payment state data:', state);
      console.log('User data:', userData);

      // Since the booking is already created, just update the payment status
      if (!state.bookingId) {
        throw new Error("No booking ID found. Please go back and create a booking first.");
      }

      // Update payment status for existing booking
      await axios.patch(`http://localhost:5000/api/bike-service/bookings/${state.bookingId}/payment`, {
        paymentStatus: 'paid'
      });

      // Show success popup
      setShowSuccessPopup(true);
    } catch (err) {
      console.error('Payment error:', err);
      const serverMsg = err?.response?.data?.error || err?.response?.data?.message;
      const friendly = serverMsg
        ? `Payment failed: ${serverMsg}`
        : (err?.message ? `Payment failed: ${err.message}` : "Payment failed. Please try again.");
      setMessage(friendly);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bike-repair-schedule-background">
      <div className="bike-repair-schedule-container">
        <h2>Payment</h2>
        <form onSubmit={submitPayment} className="bike-repair-form">
          <div className="input-group">
            <label>Company</label>
            <input type="text" value={state.selectedCompany} readOnly />
          </div>
          <div className="input-group">
            <label htmlFor="service-date">Date</label>
            <input
              id="service-date"
              type="date"
              value={serviceDate || state.date || ''}
              onChange={e => setServiceDate(e.target.value)}
              onFocus={e => { if (e.target.showPicker) { e.target.showPicker(); } }}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="input-group">
            <label>Time Slot</label>
            <input type="text" value={state.timeSlot} readOnly />
          </div>

          <div className="input-group">
            <label htmlFor="payment-method">Payment Method:</label>
            <select
              id="payment-method"
              value={paymentMethod}
              onChange={e => setPaymentMethod(e.target.value)}
            >
              <option value="visa">Visa</option>
              <option value="master">Master</option>
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="card-number">Card Number:</label>
            <input
              id="card-number"
              type="text"
              value={cardNumber}
              onChange={e => setCardNumber(e.target.value)}
              required
              maxLength={16}
              pattern="[0-9]{16}"
              title="Enter 16 digit card number"
            />
          </div>

          <div className="input-group">
            <label htmlFor="expiry">Expiry (MM/YY):</label>
            <input
              id="expiry"
              type="text"
              placeholder="MM/YY"
              value={expiry}
              onChange={e => setExpiry(e.target.value)}
              required
              pattern="^(0[1-9]|1[0-2])\/([0-9]{2})$"
              title="Enter expiry in MM/YY format"
            />
          </div>

          <div className="input-group">
            <label htmlFor="cvv">CVV:</label>
            <input
              id="cvv"
              type="password"
              value={cvv}
              onChange={e => setCvv(e.target.value)}
              required
              maxLength={4}
              pattern="[0-9]{3,4}"
              title="Enter 3 or 4 digit CVV"
            />
          </div>

          <button className="btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Pay & Confirm"}
          </button>
          {message && <div className="message">{message}</div>}
        </form>
      </div>

      {/* Success Popup */}
      <SuccessPopup
        isOpen={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
        title="Payment Successful! 🎉"
        message="Your bike service booking has been confirmed and payment processed successfully."
        bookingDetails={{
          serviceCenter: state?.selectedCompany,
          customerName: state?.customerName,
          bikeModel: state?.bikeModel,
          date: serviceDate,
          timeSlot: state?.timeSlot,
          bookingCharge: state?.bookingCharge || 300
        }}
        redirectTo="/"
        redirectDelay={5000}
      />
    </div>
  );
}

export default BikeServicePayment;


