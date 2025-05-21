import React, { useState, useEffect } from "react";
import axios from "axios";
import "./BikeRepairSchedule.css";

const TIME_SLOTS = [
  "7:30-8:00", "8:00-8:30", "8:30-9:00", "9:00-9:30",
  "9:30-10:00", "10:00-10:30", "10:30-11:00", "11:00-11:30"
];

function BikeRepairSchedule() {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [bikeModel, setBikeModel] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("visa");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/vendors")
      .then(res => {
        setCompanies(res.data);
        setFilteredCompanies(res.data);
      })
      .catch(() => {
        setMessage("Failed to load companies.");
      });
  }, []);

  useEffect(() => {
    setFilteredCompanies(
      companies.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, companies]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !selectedCompany || !customerName || !bikeModel || !date ||
      !timeSlot || !issueDescription || !contactNumber ||
      !cardNumber || !expiry || !cvv
    ) {
      setMessage("Please fill all fields.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/repair-schedule", {
        companyName: selectedCompany,
        customerName,
        bikeModel,
        repairDate: date,
        timeSlot,
        issueDescription,
        contactNumber,
        paymentMethod,
        cardNumber,
        expiry,
        cvv
      });
      setMessage("Booking successful! The company will confirm your time.");
    } catch (error) {
      setMessage("Booking failed. Try again.");
    }
  };

  const handleFindNearby = () => {
    // Dummy logic for now
    alert("Finding nearby repair centers... (to be implemented)");
  };

  return (
    <div className="bike-repair-schedule-background">
      <div className="bike-repair-schedule-container">
        <h2>Schedule Bike Repair</h2>
        <form onSubmit={handleSubmit} className="bike-repair-form">
          <div className="input-group">
            <label htmlFor="search-company">Search Company:</label>
            <input
              id="search-company"
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Type company name..."
              autoComplete="off"
            />
            <div className="company-list">
              {filteredCompanies.map(c => (
                <div
                  key={c._id}
                  className={`company-item${selectedCompany === c.name ? " selected" : ""}`}
                  onClick={() => setSelectedCompany(c.name)}
                  tabIndex={0}
                  onKeyPress={e => { if (e.key === 'Enter') setSelectedCompany(c.name); }}
                  role="button"
                  aria-pressed={selectedCompany === c.name}
                >
                  {c.name}
                </div>
              ))}
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="customer-name">Customer Name:</label>
            <input
              id="customer-name"
              type="text"
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="bike-model">Bike Model:</label>
            <input
              id="bike-model"
              type="text"
              value={bikeModel}
              onChange={e => setBikeModel(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="repair-date">Date:</label>
            <input
              id="repair-date"
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="time-slot">Time Slot:</label>
            <select
              id="time-slot"
              value={timeSlot}
              onChange={e => setTimeSlot(e.target.value)}
              required
            >
              <option value="">Select a slot</option>
              {TIME_SLOTS.map(slot => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
            <small className="slot-info">
              * Time slots are for inspection. Final timing depends on evaluation.
            </small>
          </div>

          <div className="input-group">
            <label htmlFor="issue-description">Issue Description:</label>
            <textarea
              id="issue-description"
              value={issueDescription}
              onChange={e => setIssueDescription(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="contact-number">Contact Number:</label>
            <input
              id="contact-number"
              type="tel"
              value={contactNumber}
              onChange={e => setContactNumber(e.target.value)}
              required
            />
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
              pattern="\\d{16}"
              title="Enter 16 digit card number"
            />
          </div>

          <button
            type="button"
            className="btn"
            onClick={handleFindNearby}
          >
            Find Repair Centers Near Me
          </button>

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
              pattern="\\d{3,4}"
              title="Enter 3 or 4 digit CVV"
            />
          </div>

          <button type="submit" className="btn">Book Now</button>
          {message && <div className="message">{message}</div>}
        </form>
      </div>
    </div>
  );
}

export default BikeRepairSchedule;
