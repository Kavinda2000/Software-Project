import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./BikeRepairSchedule.css";
<<<<<<< HEAD
import SuccessPopup from "../../../components/SuccessPopup";
=======
>>>>>>> f92b316531a7c0de4920f3e0a95d8d83825b1efc

function BikeRepairPayment() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("visa");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [repairDate, setRepairDate] = useState(state?.date || "");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
<<<<<<< HEAD
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
=======
>>>>>>> f92b316531a7c0de4920f3e0a95d8d83825b1efc

  if (!state) {
    return (
      <div className="bike-repair-schedule-background">
        <div className="bike-repair-schedule-container">
          <p>Missing booking details. Please start again.</p>
          <button className="btn" onClick={() => navigate("/Services/BikeRepairSchedule")}>Back to Schedule</button>
        </div>
      </div>
    );
  }

  const submitPayment = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    try {
      await axios.post("http://localhost:5000/api/repair-schedule", {
        companyName: state.selectedCompany,
        customerName: state.customerName,
        bikeModel: state.bikeModel,
        repairDate,
        timeSlot: state.timeSlot,
        issueDescription: state.issueDescription,
        contactNumber: state.contactNumber,
        paymentMethod,
        cardNumber,
        expiry,
        cvv
      });
<<<<<<< HEAD

      // Show success popup instead of just message
      setShowSuccessPopup(true);
=======
      setMessage("Payment successful and booking confirmed!");
      setTimeout(() => navigate("/"), 1200);
>>>>>>> f92b316531a7c0de4920f3e0a95d8d83825b1efc
    } catch (err) {
      setMessage("Payment failed. Please try again.");
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
            <label>Customer</label>
            <input type="text" value={state.customerName} readOnly />
          </div>
          <div className="input-group">
            <label>Bike Model</label>
            <input type="text" value={state.bikeModel} readOnly />
          </div>
          <div className="input-group">
            <label htmlFor="repair-date">Date</label>
            <input
              id="repair-date"
              type="date"
              value={repairDate}
              onChange={e => setRepairDate(e.target.value)}
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
        message="Your bike repair booking has been confirmed and payment processed successfully."
        bookingDetails={{
          serviceCenter: state?.selectedCompany,
          customerName: state?.customerName,
          bikeModel: state?.bikeModel,
          date: repairDate,
          timeSlot: state?.timeSlot,
          bookingCharge: 300
        }}
        redirectTo="/"
        redirectDelay={5000}
      />
=======
>>>>>>> f92b316531a7c0de4920f3e0a95d8d83825b1efc
    </div>
  );
}

export default BikeRepairPayment;


