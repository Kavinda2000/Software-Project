
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Services.css';

function Services() {
  const navigate = useNavigate();

  return (
    <div className='service-page'>
      <h1 className='head'>Our Services</h1>

      <div className='services-container'>
        {/* Online Service Scheduling */}
        <div className='service-card'>
          <h2>Online Service Scheduling</h2>
          <p>Book an appointment with trusted repair centers for hassle-free servicing.</p>
          <button className='service-btn' onClick={() => navigate('/schedule')}>
            Schedule Now
          </button>
        </div>

        {/* Online Payments */}
        <div className='service-card'>
          <h2>Make a Payment</h2>
          <p>Securely pay for bike parts and order online.</p>
          <button className='service-btn' onClick={() => navigate('/parts')}>
            Make a Payment
          </button>
        </div>
      </div>
    </div>
  );
}

export default Services;
