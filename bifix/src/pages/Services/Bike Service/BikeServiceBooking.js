import React, { useState } from "react";
import "./BikeServiceBooking.css";

const TIME_SLOTS = [
  "7:30am - 8:30am",
  "8:30am - 9:30am",
  "9:30am - 10:30am",
  "10:30am - 11:30am",
  "11:30am - 12:30pm",
  "12:30pm - 1:30pm",
  "1:30pm - 2:30pm",
  "2:30pm - 3:30pm",
  "3:30pm - 4:30pm",
];

function BikeServiceBooking() {
  const [company, setCompany] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("visa");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // You can add API call here
  };

  return (
    <div className="bike-service-booking-bg">
      <div className="bike-service-booking-container">
        <h2>Book Your Bike Service</h2>
        <form className="bike-service-booking-form" onSubmit={handleSubmit}>
          {/* Company Search */}
          <div className="form-group">
            <label>Search Company</label>
            <input
              type="text"
              placeholder="Enter company name"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
          </div>
          {/* Date Picker */}
          <div className="form-group">
            <label>Select Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
          {/* Time Slot */}
          <div className="form-group">
            <label>Select Time Slot</label>
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              required
            >
              <option value="">-- Select --</option>
              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>
          {/* Payment Method */}
          <div className="form-group">
            <label>Payment Method</label>
            <div className="payment-options">
              <label>
                <input
                  type="radio"
                  name="payment"
                  value="visa"
                  checked={paymentMethod === "visa"}
                  onChange={() => setPaymentMethod("visa")}
                />
                Visa
              </label>
              <label>
                <input
                  type="radio"
                  name="payment"
                  value="master"
                  checked={paymentMethod === "master"}
                  onChange={() => setPaymentMethod("master")}
                />
                MasterCard
              </label>
            </div>
          </div>
          {/* Card Details */}
          <div className="form-group">
            <label>Card Number</label>
            <input
              type="text"
              placeholder="Card Number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              required
              maxLength={16}
              pattern="\d*"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Expire Date</label>
              <input
                type="text"
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                required
                maxLength={5}
              />
            </div>
            <div className="form-group">
              <label>CVV</label>
              <input
                type="password"
                placeholder="CVV"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                required
                maxLength={4}
                pattern="\d*"
              />
            </div>
          </div>
          <button type="submit" className="bike-service-booking-btn">
            Book Now
          </button>
          {submitted && (
            <div className="success-message">
              Booking submitted! (This is a demo front end.)
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default BikeServiceBooking;