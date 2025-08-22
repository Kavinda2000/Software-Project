import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Bike Repair/BikeRepairSchedule.css";
<<<<<<< HEAD
import SuccessPopup from "../../../components/SuccessPopup";
=======
>>>>>>> cf08b2757c64ae03755541b2a3ebdf180c17b46b

function BikeServicePayment() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("visa");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [serviceDate, setServiceDate] = useState(state?.date || "");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
<<<<<<< HEAD
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
=======
>>>>>>> cf08b2757c64ae03755541b2a3ebdf180c17b46b

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
<<<<<<< HEAD
      // Resolve serviceCenterId if missing by looking up vendors API
      let resolvedServiceCenterId = state.serviceCenterId;
      if (!resolvedServiceCenterId && state.selectedCompany) {
        try {
          const vendorsResp = await axios.get("http://localhost:5000/api/vendors");
          const match = (vendorsResp.data || []).find(v => (v.name || "").toLowerCase() === state.selectedCompany.toLowerCase());
          if (match && match._id) {
            resolvedServiceCenterId = match._id;
          }
        } catch (_) {
          // ignore; handled below
        }
      }

      if (!resolvedServiceCenterId) {
        throw new Error("Missing service center. Please go back and select a service center again.");
      }

      // First create the bike service booking
      const bookingResponse = await axios.post("http://localhost:5000/api/bike-service/bookings", {
        customerName: state.customerName,
        bikeModel: state.bikeModel,
        serviceCenter: state.selectedCompany,
        serviceCenterId: resolvedServiceCenterId,
        bookingDate: serviceDate,
        timeSlot: state.timeSlot,
        issueDescription: state.issueDescription,
        contactNumber: state.contactNumber
      });

      // Then update payment status
      if (bookingResponse.data.booking._id) {
        await axios.patch(`http://localhost:5000/api/bike-service/bookings/${bookingResponse.data.booking._id}/payment`, {
          paymentStatus: 'paid'
        });
      }

      // Show success popup
      setShowSuccessPopup(true);
    } catch (err) {
      console.error('Payment error:', err);
      const serverMsg = err?.response?.data?.error || err?.response?.data?.message;
      const friendly = serverMsg
        ? `Payment failed: ${serverMsg}`
        : (err?.message ? `Payment failed: ${err.message}` : "Payment failed. Please try again.");
      setMessage(friendly);
=======
      await axios.post("http://localhost:5000/api/repair-schedule", {
        companyName: state.selectedCompany,
        customerName: state.customerName,
        bikeModel: state.bikeModel,
        repairDate: serviceDate,
        timeSlot: state.timeSlot,
        issueDescription: state.issueDescription,
        contactNumber: state.contactNumber,
        paymentMethod,
        cardNumber,
        expiry,
        cvv
      });
      setMessage("Payment successful and service booking confirmed!");
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      setMessage("Payment failed. Please try again.");
>>>>>>> cf08b2757c64ae03755541b2a3ebdf180c17b46b
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
              value={serviceDate}
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
<<<<<<< HEAD

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
=======
>>>>>>> cf08b2757c64ae03755541b2a3ebdf180c17b46b
    </div>
  );
}

export default BikeServicePayment;


