import React, { useState } from 'react';
import BikeServiceMap from './BikeServiceMap';
import './BikeService.css';

function BikeService() {
  const [search, setSearch] = useState("");

  return (
    <div className="bike-service-background">
      <div className="bike-service-container">
        <h1 className="bike-service-title">Bike Service Centers</h1>
        <div className="bike-service-search-container">
          <input
            className="bike-service-input"
            type="text"
            placeholder="Search for a service center..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="bike-service-button">Search</button>
        </div>
        <BikeServiceMap />
      </div>
    </div>
  );
}

export default BikeService;
