import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SchedulingBlock.css';

function SchedulingBlock({ userData }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (userData?.email) {
      fetchCustomerBookings();
    }
  }, [userData]);

  const fetchCustomerBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/bike-service/customer-bookings/${userData.email}`);
      
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

  if (loading) {
    return (
      <div className="scheduling-block">
        <h2>Your Scheduled Appointments</h2>
        <div className="loading">Loading your appointments...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="scheduling-block">
        <h2>Your Scheduled Appointments</h2>
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="scheduling-block">
      <div className="scheduling-header">
        <h2>Your Scheduled Appointments</h2>
        <button 
          className="new-booking-btn"
          onClick={() => navigate('/Services')}
        >
          + New Booking
        </button>
      </div>
      
      {bookings.length === 0 ? (
        <div className="no-bookings">
          <p>You have no scheduled appointments yet.</p>
          <p>Book your first service appointment now!</p>
        </div>
      ) : (
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
      )}
    </div>
  );
}

export default SchedulingBlock;
