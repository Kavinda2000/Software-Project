import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();
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
  const [submitted, setSubmitted] = useState(false);
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
        // keep silent on failure for now
      });
  }, []);

  // Handle selected service center from map
  useEffect(() => {
    if (location.state?.selectedServiceCenter) {
      const center = location.state.selectedServiceCenter;
      setSelectedCompany(center.name);
      setSearch(center.name);
    }
  }, [location.state]);

  useEffect(() => {
    setFilteredCompanies(
      companies.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedCompany || !customerName || !bikeModel || !date || !timeSlot || !issueDescription || !contactNumber) {
      setSubmitted(false);
      return;
    }
    setSubmitted(true);
    navigate("/Services/BikeServicePayment", {
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
    <div className="bike-service-booking-bg">
      <div className="bike-service-booking-container">
        <h2>Book Your Bike Service</h2>
        <form className="bike-service-booking-form" onSubmit={handleSubmit}>
          {/* Customer Name */}
          <div className="form-group">
            <label htmlFor="customer-name">Customer Name</label>
            <input
              id="customer-name"
              type="text"
              placeholder="Enter your name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
          </div>
          {/* Bike Model */}
          <div className="form-group">
            <label htmlFor="bike-model">Bike Model</label>
            <input
              id="bike-model"
              type="text"
              placeholder="Enter bike model"
              value={bikeModel}
              onChange={(e) => setBikeModel(e.target.value)}
              required
            />
          </div>
          {/* Company Search */}
          <div className="form-group">
            <label htmlFor="service-search-company">Search Company</label>
            <div className="autocomplete">
              <input
                id="service-search-company"
                type="text"
                placeholder="Enter company name"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                aria-autocomplete="list"
                aria-expanded={showSuggestions}
                aria-controls="service-company-suggestions"
                required
              />
              {showSuggestions && search && (
                <div id="service-company-suggestions" className="company-list" role="listbox">
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
          {/* Date Picker */}
          <div className="form-group">
            <label>Select Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              onFocus={(e) => { if (e.target.showPicker) { e.target.showPicker(); } }}
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
          {/* Issue / Service Description */}
          <div className="form-group">
            <label htmlFor="issue-description">Describe Service Need</label>
            <input
              id="issue-description"
              type="text"
              placeholder="Brief description"
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              required
            />
          </div>
                     {/* Contact Number */}
           <div className="form-group">
             <label htmlFor="contact-number">Contact Number</label>
                          <input
                id="contact-number"
                type="tel"
                placeholder="Enter contact number"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
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
                   <li>This Rs. 300 is an <strong>initial booking charge</strong> for service inspection and scheduling.</li>
                   <li>The actual service cost will be determined after the initial inspection.</li>
                   <li>This booking charge will be <strong>deducted from the final service payment</strong>.</li>
                   <li>Additional charges may apply based on the service requirements identified during inspection.</li>
                   <li>Payment can be adjusted or refunded based on the final service assessment.</li>
                 </ul>
               </div>
             </div>
           </div>
          <button type="submit" className="bike-service-booking-btn">
            Continue to Payment
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