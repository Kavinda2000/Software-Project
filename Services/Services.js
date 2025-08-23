// pages/Services.js
import React, { useState } from 'react';
import './Services.css';
import ServiceNav from './Navigation/ServiceNav';
import ServiceSidebar from './sidebar/ServiceSidebar';
import ServiceList from './components/ServiceList';
import ServicesCards from './Serv'; // ✅ alias import to avoid conflict

function Services() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  return (
    <>
      <ServiceNav query={query} setQuery={setQuery} />
      <div className="services-page">
        <div className="services-content">
          {/* Left side: Card-based Services component */}
          <div style={{ flex: 1 }}>
            <ServicesCards />
          </div>

          {/* Right side: Sidebar + List */}
          <div style={{ flex: 2 }}>
            <ServiceSidebar
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
            <ServiceList query={query} selectedCategory={selectedCategory} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Services;
