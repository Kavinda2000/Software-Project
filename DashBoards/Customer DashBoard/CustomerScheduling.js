import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CustomerScheduling.css';

function CustomerScheduling() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get user data from session storage or location state
    const userData = location.state?.user || JSON.parse(sessionStorage.getItem('userData'));
    
    if (!userData) {
      navigate('/login');
      return;
    }

    fetchCustomerBookings(userData.email);
  }, [navigate, location.state]);

  const fetchCustomerBookings = async (userEmail) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/bike-service/customer-bookings/${userEmail}`);
      
      if (response.data.success) {
        setBookings(response.data.bookings);
      } else {
        setError('Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Error loading bookings');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'status-confirmed';
      case 'in-progress':
        return 'status-in-progress';
      case 'completed':
        return 'status-completed';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-pending';
    }
  };

  const handleNewBooking = () => {
    navigate('/Services');
  };

  const handleBackToDashboard = () => {
    navigate('/customer-dashboard');
  };

  if (loading) {
    return (
      <div className="customer-scheduling-page">
        <div className="loading-container">
          <div className="loading">Loading your appointments...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="customer-scheduling-page">
        <div className="error-container">
          <h2>Error Loading Appointments</h2>
          <p>{error}</p>
          <button onClick={handleBackToDashboard} className="back-btn">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer autoClose={3000} />
      <div className="customer-scheduling-page">
        <div className="scheduling-header">
          <button onClick={handleBackToDashboard} className="back-btn">
            ← Back to Dashboard
          </button>
          <h1>Your Scheduled Appointments</h1>
          <button onClick={handleNewBooking} className="new-booking-btn">
            + New Booking
          </button>
        </div>

        {bookings.length === 0 ? (
          <div className="no-bookings-container">
            <div className="no-bookings">
              <h2>No Appointments Found</h2>
              <p>You haven't scheduled any service appointments yet.</p>
              <p>Book your first service appointment now!</p>
              <button onClick={handleNewBooking} className="cta-booking-btn">
                Book Your First Appointment
              </button>
            </div>
          </div>
        ) : (
          <div className="bookings-container">
            <div className="bookings-summary">
              <h3>You have {bookings.length} appointment{bookings.length !== 1 ? 's' : ''}</h3>
            </div>
            
            <div className="bookings-list">
              {bookings.map((booking) => (
                <div key={booking._id} className="booking-card">
                  <div className="booking-header">
                    <h3>{booking.serviceCenter}</h3>
                    <span className={`status ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                  
                  <div className="booking-details">
                    <div className="detail-row">
                      <span className="label">Date:</span>
                      <span className="value">{formatDate(booking.bookingDate)}</span>
                    </div>
                    
                    <div className="detail-row">
                      <span className="label">Time:</span>
                      <span className="value">{booking.timeSlot}</span>
                    </div>
                    
                    <div className="detail-row">
                      <span className="label">Bike Model:</span>
                      <span className="value">{booking.bikeModel}</span>
                    </div>
                    
                    <div className="detail-row">
                      <span className="label">Service Type:</span>
                      <span className="value">Bike Service</span>
                    </div>
                    
                    {booking.serviceCenterId && (
                      <>
                        <div className="detail-row">
                          <span className="label">Phone:</span>
                          <span className="value">{booking.serviceCenterId.phone || 'Not available'}</span>
                        </div>
                        
                        <div className="detail-row">
                          <span className="label">Address:</span>
                          <span className="value">{booking.serviceCenterId.address || 'Not available'}</span>
                        </div>
                      </>
                    )}
                    
                    <div className="detail-row">
                      <span className="label">Issue Description:</span>
                      <span className="value">{booking.issueDescription}</span>
                    </div>
                    
                    <div className="detail-row">
                      <span className="label">Payment Status:</span>
                      <span className={`payment-status ${booking.paymentStatus === 'paid' ? 'paid' : 'pending'}`}>
                        {booking.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default CustomerScheduling;
