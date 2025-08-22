import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "./BikeServiceBooking.css";

const TIME_SLOTS = [
<<<<<<< HEAD
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
    const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [loadingVendors, setLoadingVendors] = useState(true);
    const [vendorError, setVendorError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        setLoadingVendors(true);
        setVendorError(null);
        axios
            .get("http://localhost:5000/api/vendors")
            .then((res) => {
                setCompanies(res.data);
                setFilteredCompanies(res.data);
                setLoadingVendors(false);
            })
            .catch((error) => {
                console.error("Error fetching vendors:", error);
                setVendorError("Failed to load service centers. Please try again.");
                setLoadingVendors(false);
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

    // Check available time slots when date and service center are selected
    useEffect(() => {
        const checkAvailableSlots = async () => {
            if (date && selectedCompany) {
                setLoadingSlots(true);
                try {
                    const selectedCompanyData = companies.find(
                        (c) => c.name === selectedCompany
                    );
                    if (selectedCompanyData) {
                        const response = await axios.get(
                            "http://localhost:5000/api/bike-service/available-slots",
                            {
                                params: {
                                    serviceCenterId: selectedCompanyData._id,
                                    date: date,
                                },
                            }
                        );
                        setAvailableTimeSlots(response.data.availableSlots);
                    }
                } catch (error) {
                    console.error("Error fetching available slots:", error);
                } finally {
                    setLoadingSlots(false);
                }
            }
        };

        checkAvailableSlots();
    }, [date, selectedCompany, companies]);

    useEffect(() => {
        const filtered = companies.filter((c) =>
            c.name.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredCompanies(filtered);
        setActiveIndex(-1);
    }, [search, companies]);

    const handleSelect = (name) => {
        setSelectedCompany(name);
        setSearch(name);
        setShowSuggestions(false);
    };

    const handleKeyDown = (e) => {
        if (!showSuggestions || filteredCompanies.length === 0) return;
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((prev) => Math.min(prev + 1, filteredCompanies.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((prev) => Math.max(prev - 1, 0));
        } else if (e.key === "Enter") {
            if (activeIndex >= 0 && filteredCompanies[activeIndex]) {
                e.preventDefault();
                handleSelect(filteredCompanies[activeIndex].name);
            }
        } else if (e.key === "Escape") {
            setShowSuggestions(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            !selectedCompany ||
            !customerName ||
            !bikeModel ||
            !date ||
            !timeSlot ||
            !issueDescription ||
            !contactNumber
        ) {
            setSubmitted(false);
            return;
        }

        try {
            const selectedCompanyData = companies.find(
                (c) => c.name === selectedCompany
            );
            if (!selectedCompanyData) {
                alert("Please select a valid service center");
                return;
            }

            const bookingData = {
                customerName,
                bikeModel,
                serviceCenter: selectedCompany,
                serviceCenterId: selectedCompanyData._id,
                bookingDate: date,
                timeSlot,
                issueDescription,
                contactNumber,
            };

            const response = await axios.post(
                "http://localhost:5000/api/bike-service/bookings",
                bookingData
            );

            if (response.status === 201) {
                setSubmitted(true);
                navigate("/Services/BikeServicePayment", {
                    state: {
                        bookingId: response.data.booking._id,
                        selectedCompany,
                        customerName,
                        bikeModel,
                        date,
                        timeSlot,
                        issueDescription,
                        contactNumber,
                        bookingCharge: response.data.booking.bookingCharge,
                        serviceCenterId: selectedCompanyData._id,
                    },
                });
            }
        } catch (error) {
            console.error("Error creating booking:", error);
            if (error.response?.status === 409) {
                alert("This time slot is already booked. Please select another time.");
            } else {
                alert("Error creating booking. Please try again.");
            }
            setSubmitted(false);
        }
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
                                placeholder={
                                    loadingVendors ? "Loading service centers..." : "Enter company name"
                                }
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setShowSuggestions(true);
                                }}
                                onFocus={() => !loadingVendors && setShowSuggestions(true)}
                                onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                                onKeyDown={handleKeyDown}
                                autoComplete="off"
                                aria-autocomplete="list"
                                aria-expanded={showSuggestions}
                                aria-controls="service-company-suggestions"
                                required
                                disabled={loadingVendors}
                            />
                            {loadingVendors && (
                                <div className="loading-message">Loading service centers...</div>
                            )}
                            {vendorError && (
                                <div className="error-message">{vendorError}</div>
                            )}
                            {showSuggestions && search && !loadingVendors && (
                                <div
                                    id="service-company-suggestions"
                                    className="company-list"
                                    role="listbox"
                                >
                                    {filteredCompanies.length > 0 ? (
                                        filteredCompanies.map((c, index) => (
                                            <div
                                                key={c._id}
                                                className={`company-item${selectedCompany === c.name ? " selected" : ""
                                                    }${index === activeIndex ? " active" : ""}`}
                                                onMouseDown={() => handleSelect(c.name)}
                                                tabIndex={-1}
                                                role="option"
                                                aria-selected={selectedCompany === c.name}
                                            >
                                                <div className="company-name">{c.name}</div>
                                                {c.address && (
                                                    <div className="company-address">{c.address}</div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="company-item">No service centers found</div>
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
                            onFocus={(e) => {
                                if (e.target.showPicker) {
                                    e.target.showPicker();
                                }
                            }}
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
                            disabled={loadingSlots || !date || !selectedCompany}
                        >
                            <option value="">
                                {loadingSlots
                                    ? "Loading available slots..."
                                    : !date
                                        ? "Please select a date first"
                                        : !selectedCompany
                                            ? "Please select a service center first"
                                            : "-- Select --"}
                            </option>
                            {availableTimeSlots.length > 0 ? (
                                availableTimeSlots.map((slot) => (
                                    <option key={slot} value={slot}>
                                        {slot} ✅ Available
                                    </option>
                                ))
                            ) : (
                                date &&
                                selectedCompany &&
                                !loadingSlots && (
                                    <option value="" disabled>
                                        No available slots for this date
                                    </option>
                                )
                            )}
                        </select>
                        {date && selectedCompany && !loadingSlots && (
                            <small className="slot-info">
                                {availableTimeSlots.length} of {TIME_SLOTS.length} slots available
                            </small>
                        )}
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
                                <p>
                                    <strong>Important Note:</strong>
                                </p>
                                <ul>
                                    <li>
                                        This Rs. 300 is an <strong>initial booking charge</strong> for
                                        service inspection and scheduling.
                                    </li>
                                    <li>
                                        The actual service cost will be determined after the initial
                                        inspection.
                                    </li>
                                    <li>
                                        This booking charge will be <strong>deducted from the final
                                            service payment</strong>.
                                    </li>
                                    <li>
                                        Additional charges may apply based on the service requirements
                                        identified during inspection.
                                    </li>
                                    <li>
                                        Payment can be adjusted or refunded based on the final service
                                        assessment.
                                    </li>
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



=======
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
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
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

  // Check available time slots when date and service center are selected
  useEffect(() => {
    const checkAvailableSlots = async () => {
      if (date && selectedCompany) {
        setLoadingSlots(true);
        try {
          const selectedCompanyData = companies.find(c => c.name === selectedCompany);
          if (selectedCompanyData) {
            const response = await axios.get('http://localhost:5000/api/bike-service/available-slots', {
              params: {
                serviceCenterId: selectedCompanyData._id,
                date: date
              }
            });
            setAvailableTimeSlots(response.data.availableSlots);
          }
        } catch (error) {
          console.error('Error fetching available slots:', error);
        } finally {
          setLoadingSlots(false);
        }
      }
    };

    checkAvailableSlots();
  }, [date, selectedCompany, companies]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCompany || !customerName || !bikeModel || !date || !timeSlot || !issueDescription || !contactNumber) {
      setSubmitted(false);
      return;
    }

    try {
      // Find the selected company's ID
      const selectedCompanyData = companies.find(c => c.name === selectedCompany);
      if (!selectedCompanyData) {
        alert('Please select a valid service center');
        return;
      }

      // Create booking data
      const bookingData = {
        customerName,
        bikeModel,
        serviceCenter: selectedCompany,
        serviceCenterId: selectedCompanyData._id,
        bookingDate: date,
        timeSlot,
        issueDescription,
        contactNumber
      };

      // Send booking to backend
      const response = await axios.post('http://localhost:5000/api/bike-service/bookings', bookingData);
      
      if (response.status === 201) {
        setSubmitted(true);
        navigate("/Services/BikeServicePayment", {
          state: {
            bookingId: response.data.booking._id,
            selectedCompany,
            customerName,
            bikeModel,
            date,
            timeSlot,
            issueDescription,
            contactNumber,
            bookingCharge: response.data.booking.bookingCharge
          }
        });
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      if (error.response?.status === 409) {
        alert('This time slot is already booked. Please select another time.');
      } else {
        alert('Error creating booking. Please try again.');
      }
      setSubmitted(false);
    }
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
              disabled={loadingSlots || !date || !selectedCompany}
            >
              <option value="">
                {loadingSlots ? 'Loading available slots...' : 
                 !date ? 'Please select a date first' :
                 !selectedCompany ? 'Please select a service center first' :
                 '-- Select --'}
              </option>
              {availableTimeSlots.length > 0 ? (
                availableTimeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot} ✅ Available
                  </option>
                ))
              ) : (
                date && selectedCompany && !loadingSlots && (
                  <option value="" disabled>No available slots for this date</option>
                )
              )}
            </select>
            {date && selectedCompany && !loadingSlots && (
              <small className="slot-info">
                {availableTimeSlots.length} of {TIME_SLOTS.length} slots available
              </small>
            )}
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
>>>>>>> f92b316531a7c0de4920f3e0a95d8d83825b1efc
