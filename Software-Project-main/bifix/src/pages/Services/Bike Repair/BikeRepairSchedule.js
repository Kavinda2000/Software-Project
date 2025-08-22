import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const [message, setMessage] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const navigate = useNavigate();

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
    setActiveIndex(-1);
  }, [search, companies]);

  const handleSelect = (name) => {
    setSelectedCompany(name);
    setSearch(name);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || filteredCompanies.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => Math.min(prev + 1, filteredCompanies.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && filteredCompanies[activeIndex]) {
        e.preventDefault();
        handleSelect(filteredCompanies[activeIndex].name);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !selectedCompany || !customerName || !bikeModel || !date ||
      !timeSlot || !issueDescription || !contactNumber
    ) {
      setMessage("Please fill all fields.");
      return;
    }

    navigate("/Services/BikeRepairPayment", {
      state: {
        selectedCompany,
        customerName,
        bikeModel,
        date,
        timeSlot,
        issueDescription,
        contactNumber
      }
    });
  };



  return (
    <div className="bike-repair-schedule-background">
      <div className="bike-repair-schedule-container">
        <h2>Schedule Bike Repair</h2>
        <form onSubmit={handleSubmit} className="bike-repair-form">
          <div className="input-group">
            <label htmlFor="search-company">Search Company:</label>
            <div className="autocomplete">
              <input
                id="search-company"
                type="text"
                value={search}
                onChange={e => { setSearch(e.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                onKeyDown={handleKeyDown}
                placeholder="Type company name..."
                autoComplete="off"
                aria-autocomplete="list"
                aria-expanded={showSuggestions}
                aria-controls="company-suggestions"
              />
              {showSuggestions && search && (
                <div id="company-suggestions" className="company-list" role="listbox">
                  {filteredCompanies.length > 0 ? (
                    filteredCompanies.map((c, index) => (
                      <div
                        key={c._id}
                        className={`company-item${selectedCompany === c.name ? " selected" : ""}${index === activeIndex ? " active" : ""}`}
                        onMouseDown={() => handleSelect(c.name)}
                        tabIndex={-1}
                        role="option"
                        aria-selected={selectedCompany === c.name}
                      >
                        {c.name}
                      </div>
                    ))
                  ) : (
                    <div className="company-item">No results</div>
                  )}
                </div>
              )}
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
              onFocus={e => { if (e.target.showPicker) { e.target.showPicker(); } }}
              min={new Date().toISOString().split('T')[0]}
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

          {/* Booking Charge Information */}
          <div className="booking-charge-section">
            <div className="charge-display">
              <h3>Booking Charge</h3>
              <div className="charge-amount">
                <span className="currency">Rs.</span>
                <span className="amount">300</span>
              </div>
              <p className="charge-description">Initial inspection and booking fee</p>
            </div>

            <div className="payment-note">
              <h4>Payment Information</h4>
              <div className="note-content">
                <p><strong>Important Note:</strong></p>
                <ul>
                  <li>This Rs. 300 is an <strong>initial booking charge</strong> for repair inspection and scheduling.</li>
                  <li>The actual repair cost will be determined after the initial inspection.</li>
                  <li>This booking charge will be <strong>deducted from the final repair payment</strong>.</li>
                  <li>Additional charges may apply based on the repair requirements identified during inspection.</li>
                  <li>Payment can be adjusted or refunded based on the final repair assessment.</li>
                </ul>
              </div>
            </div>
          </div>

          <button type="submit" className="btn">Continue to Payment</button>
          {message && <div className="message">{message}</div>}
        </form>
      </div>
    </div>
  );
}

export default BikeRepairSchedule;