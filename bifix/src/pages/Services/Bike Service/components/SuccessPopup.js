import React, { useEffect } from 'react';
import './SuccessPopup.css';

const SuccessPopup = ({ 
  isOpen, 
  onClose, 
  title = "Payment Successful!", 
  message = "Your booking has been confirmed.",
  bookingDetails = {},
  redirectTo = "/",
  redirectDelay = 3000 
}) => {
  
  useEffect(() => {
    if (isOpen) {
      // Auto redirect after delay
      const timer = setTimeout(() => {
        onClose();
        if (redirectTo) {
          window.location.href = redirectTo;
        }
      }, redirectDelay);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, redirectTo, redirectDelay]);

  if (!isOpen) return null;

  return (
    <div className="success-popup-overlay">
      <div className="success-popup-container">
        {/* Success Animation */}
        <div className="success-animation">
          <div className="checkmark-circle">
            <div className="checkmark"></div>
          </div>
        </div>

        {/* Content */}
        <div className="success-content">
          <h2 className="success-title">{title}</h2>
          <p className="success-message">{message}</p>
          
          {/* Booking Details */}
          {Object.keys(bookingDetails).length > 0 && (
            <div className="booking-details">
              <h3>Booking Details</h3>
              <div className="details-grid">
                {bookingDetails.serviceCenter && (
                  <div className="detail-item">
                    <span className="detail-label">Service Center:</span>
                    <span className="detail-value">{bookingDetails.serviceCenter}</span>
                  </div>
                )}
                {bookingDetails.customerName && (
                  <div className="detail-item">
                    <span className="detail-label">Customer:</span>
                    <span className="detail-value">{bookingDetails.customerName}</span>
                  </div>
                )}
                {bookingDetails.bikeModel && (
                  <div className="detail-item">
                    <span className="detail-label">Bike Model:</span>
                    <span className="detail-value">{bookingDetails.bikeModel}</span>
                  </div>
                )}
                {bookingDetails.date && (
                  <div className="detail-item">
                    <span className="detail-label">Date:</span>
                    <span className="detail-value">{new Date(bookingDetails.date).toLocaleDateString()}</span>
                  </div>
                )}
                {bookingDetails.timeSlot && (
                  <div className="detail-item">
                    <span className="detail-label">Time:</span>
                    <span className="detail-value">{bookingDetails.timeSlot}</span>
                  </div>
                )}
                {bookingDetails.bookingCharge && (
                  <div className="detail-item">
                    <span className="detail-label">Amount Paid:</span>
                    <span className="detail-value amount">Rs. {bookingDetails.bookingCharge}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="success-actions">
            <button 
              className="success-btn primary" 
              onClick={() => {
                onClose();
                if (redirectTo) {
                  window.location.href = redirectTo;
                }
              }}
            >
              Continue to Home
            </button>
            <button 
              className="success-btn secondary" 
              onClick={onClose}
            >
              Close
            </button>
          </div>

          {/* Auto redirect notice */}
          <p className="redirect-notice">
            Redirecting to home page in {Math.ceil(redirectDelay / 1000)} seconds...
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessPopup;