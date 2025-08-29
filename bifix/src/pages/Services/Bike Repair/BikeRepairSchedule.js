import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./BikeRepairSchedule.css";

function BikeRepairSchedule() {
  const [search, setSearch] = useState("");
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState(""); // store service _id
  const [customerName, setCustomerName] = useState("");
  const [bikeModel, setBikeModel] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [message, setMessage] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [timeSlots, setTimeSlots] = useState([]);
  const navigate = useNavigate();

  // Load repair centers
  useEffect(() => {
    axios.get("http://localhost:5000/api/tests?type=Bike Repair")
      .then(res => setFilteredCompanies(res.data.data))
      .catch(() => setMessage("Failed to load repair centers."));
  }, []);

  // Select a company from the list
  const handleSelect = (name, id) => {
    setSelectedCompany(name);
    setSelectedServiceId(id);
    setSearch(name);
    setShowSuggestions(false);

    // Load time slots for selected service
    axios.get(`http://localhost:5000/api/tests/${id}`)
      .then(res => setTimeSlots(res.data.data.timeSlots))
      .catch(() => setMessage("Failed to load vendor details."));
  };

  // Keyboard navigation in autocomplete
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
        handleSelect(filteredCompanies[activeIndex].name, filteredCompanies[activeIndex]._id);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const userData = JSON.parse(sessionStorage.getItem('userData'));
    if (!userData) {
      navigate('/login', { state: { from: '/Services/BikeRepairSchedule', message: 'Please log in to continue' }});
      return;
    }

    if (!selectedCompany || !selectedServiceId || !customerName || !bikeModel || !date || !timeSlot || !issueDescription || !contactNumber) {
      setMessage("Please fill all fields.");
      return;
    }

    // Navigate to payment page with all required info including serviceId
    navigate("/Services/BikeRepairPayment", {
      state: {
        selectedCompany,
        selectedServiceId,
        customerName,
        bikeModel,
        date,
        timeSlot,
        issueDescription,
        contactNumber,
        email: userData.email
      }
    });
  };

  return (
    <div className="bike-repair-schedule-background">
      <div className="bike-repair-schedule-container">
        <h2>Schedule Bike Repair</h2>
        <form onSubmit={handleSubmit} className="bike-repair-form">

          {/* Search Repair Center */}
          <div className="input-group">
            <label htmlFor="search-company">Search Repair Center:</label>
            <div className="autocomplete">
              <input
                id="search-company"
                type="text"
                value={search}
                onChange={e => { setSearch(e.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                onKeyDown={handleKeyDown}
                placeholder="Type repair center name..."
                autoComplete="off"
              />
              {showSuggestions && search && (
                <div className="company-list">
                  {filteredCompanies.length > 0 ? (
                    filteredCompanies.map((test, index) => (
                      <div
                        key={test._id}
                        className={`company-item${selectedCompany === test.name ? " selected" : ""}${index === activeIndex ? " active" : ""}`}
                        onMouseDown={() => handleSelect(test.name, test._id)}
                      >
                        {test.name}
                      </div>
                    ))
                  ) : (
                    <div className="company-item">No results</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Customer Details */}
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
              min={new Date().toISOString().split('T')[0]}
              required
              style={{ appearance: 'auto' }}
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
              {timeSlots.map(slotObj => (
                <option key={slotObj._id} value={slotObj.slot}>
                  {slotObj.slot}
                </option>
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

          <button type="submit" className="btn">Continue to Payment</button>
          {message && <div className="message">{message}</div>}
        </form>
      </div>
    </div>
  );
}

export default BikeRepairSchedule;
