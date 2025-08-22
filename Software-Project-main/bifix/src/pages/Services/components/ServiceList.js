import React, { useState, useEffect } from 'react';
import ServiceCard from './ServiceCard';
import './ServiceList.css';

// Dummy data for demonstration
const SERVICES = [
  {
    _id: 1,
    title: "Engine Tune-Up",
    description: "Professional engine tune-up for optimal performance.",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    category: "Engine"
  },
  {
    _id: 2,
    title: "Oil Change",
    description: "Quick and affordable oil change service.",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&q=80",
    category: "Oil Change"
  },
  {
    _id: 3,
    title: "Brake Inspection",
    description: "Comprehensive brake system inspection.",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
    category: "Brakes"
  }
];

function ServiceList({ query, selectedCategory }) {
  const [services, setServices] = useState(SERVICES);

  useEffect(() => {
    let filtered = SERVICES;
    if (selectedCategory && selectedCategory !== "All") {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }
    if (query.trim() !== '') {
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(query.toLowerCase())
      );
    }
    setServices(filtered);
  }, [query, selectedCategory]);

  return (
    <div className="service-list">
      {services.length === 0 ? (
        <div className="service-list-empty">No services found.</div>
      ) : (
        services.map(service => (
          <ServiceCard key={service._id} service={service} />
        ))
      )}
    </div>
  );
}

export default ServiceList;