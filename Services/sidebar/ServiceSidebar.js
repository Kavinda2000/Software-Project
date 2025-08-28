import React from 'react';
import './ServiceSidebar.css';

function ServiceSidebar({ selectedCategory, setSelectedCategory }) {
  const categories = [
    "All",
    "Service Centers",
    "Repair Centers",
    "Brakes",
    "Inspection",
    "Tuning",
    "Other"
  ];

  return (
    <div className="service-sidebar">
      <h3 className="service-sidebar-title">Filter by Category</h3>
      <ul className="service-sidebar-list">
        {categories.map(cat => (
          <li
            key={cat}
            className={`service-sidebar-item${selectedCategory === cat ? ' active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ServiceSidebar;