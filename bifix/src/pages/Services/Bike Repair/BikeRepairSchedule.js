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

  // Fetch companies from backend
  useEffect(() => {
    axios.get("http://localhost:5000/api/vendors")
      .then(res => {
        setCompanies(res.data);
        setFilteredCompanies(res.data);
      });
  }, []);

  // Filter companies as user types
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
      !selectedCompany ||
      !customerName ||
      !bikeModel ||
      !date ||
      !timeSlot ||
      !issueDescription ||
      !contactNumber ||
      !cardNumber ||
      !expiry ||
      !cvv
    ) {
      setMessage("Please fill all fields.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/repair-schedule", {
        customerName,
        bikeModel,
        repairDate: date,
        issueDescription,
        contactNumber
      });

      setMessage("Booking successful! The company will confirm your time after checking your bike.");
    } catch {
      setMessage("Booking failed. Try again.");
    }
  };

  return (
    <div className="bike-repair-schedule-background">
      <div className="bike-repair-schedule-container">
        <h2>Schedule Bike Repair</h2>
        <form onSubmit={handleSubmit} className="bike-repair-form">
          <div>
            <label>Search Company:</label>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Type company name..."
            />
            <div className="company-list">
              {filteredCompanies.map(c => (
                <div
                  key={c._id}
                  className={`company-item${selectedCompany === c.name ? " selected" : ""}`}
                  onClick={() => setSelectedCompany(c.name)}
                >
                  {c.name}
                </div>
              ))}
            </div>
          </div>
          <div>
            <label>Customer Name:</label>
            <input
              type="text"
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Bike Model:</label>
            <input
              type="text"
              value={bikeModel}
              onChange={e => setBikeModel(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Date:</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Time Slot:</label>
            <select value={timeSlot} onChange={e => setTimeSlot(e.target.value)} required>
              <option value="">Select a slot</option>
              {TIME_SLOTS.map(slot => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
            <div className="slot-info">
              * Time slots are for initial inspection. Final repair time will be provided after checking your bike.
            </div>
          </div>
          <div>
            <label>Issue Description:</label>
            <textarea
              value={issueDescription}
              onChange={e => setIssueDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Contact Number:</label>
            <input
              type="text"
              value={contactNumber}
              onChange={e => setContactNumber(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Payment Method:</label>
            <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
              <option value="visa">Visa</option>
              <option value="master">Master</option>
            </select>
          </div>
          <div>
            <label>Card Number:</label>
            <input
              type="text"
              value={cardNumber}
              onChange={e => setCardNumber(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Expiry:</label>
            <input
              type="text"
              placeholder="MM/YY"
              value={expiry}
              onChange={e => setExpiry(e.target.value)}
              required
            />
          </div>
          <div>
            <label>CVV:</label>
            <input
              type="password"
              value={cvv}
              onChange={e => setCvv(e.target.value)}
              required
            />
          </div>
          <button type="submit">Book Now</button>
          {message && <div className="message">{message}</div>}
        </form>
      </div>
    </div>
  );
}

export default BikeRepairSchedule;
