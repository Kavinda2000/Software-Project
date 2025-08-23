import React from 'react';
import './ServiceCard.css';

function ServiceCard({ service }) {
  return (
    <div className="service-card">
      <img src={service.image} alt={service.title} className="service-card-img" />
      <div className="service-card-content">
        <h3 className="service-card-title">{service.title}</h3>
        <p className="service-card-desc">{service.description}</p>
        <div className="service-card-footer">
          <span className="service-card-price">${service.price}</span>
        </div>
      </div>
    </div>
  );
}

export default ServiceCard;