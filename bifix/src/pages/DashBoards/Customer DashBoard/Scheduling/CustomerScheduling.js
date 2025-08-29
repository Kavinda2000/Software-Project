import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import './CusomerScheduling.css';

function CustomerScheduling() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
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
      const response = await axios.get(`http://localhost:5000/api/repair-schedule/customer-bookings/${userEmail}`);
      if (response.data.success) {
        setBookings(response.data.bookings);
      } else {
        setError('Failed to fetch bookings');
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
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
        return 'csu-status-confirmed';
      case 'in-progress':
        return 'csu-status-in-progress';
      case 'completed':
        return 'csu-status-completed';
      case 'cancelled':
        return 'csu-status-cancelled';
      default:
        return 'csu-status-pending';
    }
  };

  const handleBackToDashboard = () => navigate('/customer-dashboard');

  if (loading) {
    return (
      <div className="csu-page">
        <div className="csu-loading-container">
          <div className="csu-loading">Loading your appointments...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="csu-page">
        <div className="csu-error-container">
          <h2>Error Loading Appointments</h2>
          <p>{error}</p>
          <button onClick={handleBackToDashboard} className="csu-back-btn">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="csu-page">
      <div className="csu-header">
        <button onClick={handleBackToDashboard} className="csu-back-btn">
          ← Back to Dashboard
        </button>
        <h1 className="csu-title">Your Appointments</h1>
      </div>

      {bookings.length === 0 ? (
        <div className="csu-no-bookings-container">
          <div className="csu-no-bookings">
            <h2>No Appointments Found</h2>
            <p>You haven't scheduled any service appointments yet.</p>
            <p>Book your first service appointment now!</p>
          </div>
        </div>
      ) : (
        <div className="csu-bookings-container">
          <div className="csu-bookings-summary">
            <h3>You have {bookings.length} appointment{bookings.length !== 1 ? 's' : ''}</h3>
          </div>

          <div className="csu-bookings-list">
            {bookings.map((booking) => (
              <div key={booking._id} className="csu-booking-card">
                <div className="csu-booking-header">
                  <h3>{booking.companyName}</h3>
                  <span className={`csu-status ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>

                <div className="csu-booking-details">
                  <div className="csu-detail-row">
                    <span className="csu-label">Date:</span>
                    <span className="csu-value">{formatDate(booking.repairDate)}</span>
                  </div>

                  <div className="csu-detail-row">
                    <span className="csu-label">Time:</span>
                    <span className="csu-value">{booking.timeSlot}</span>
                  </div>

                  <div className="csu-detail-row">
                    <span className="csu-label">Bike Model:</span>
                    <span className="csu-value">{booking.bikeModel}</span>
                  </div>

                  <div className="csu-detail-row">
                    <span className="csu-label">Service Type:</span>
                    <span className="csu-value">Bike Service</span>
                  </div>

                  <div className="csu-detail-row">
                    <span className="csu-label">Issue Description:</span>
                    <span className="csu-value">{booking.issueDescription}</span>
                  </div>

                  <div className="csu-detail-row">
                    <span className="csu-label">Payment Status:</span>
                    <span className={`csu-payment-status ${booking.paymentStatus === 'paid' ? 'csu-paid' : 'csu-pending'}`}>
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
  );
}

export default CustomerScheduling;
