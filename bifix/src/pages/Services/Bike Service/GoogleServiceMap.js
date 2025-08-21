import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './GoogleServiceMap.css';

function GoogleServiceMap() {
  const navigate = useNavigate();
  const [serviceCenters, setServiceCenters] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Error getting location:', error);
          // Default to Colombo if location access is denied
          setUserLocation({ lat: 6.9271, lng: 79.8612 });
        }
      );
    }

    // Fetch service centers from backend
    fetchServiceCenters();
  }, []);

  const fetchServiceCenters = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/vendors');
      // Transform vendor data to include coordinates
      const centersWithCoords = response.data.map((vendor, index) => ({
        id: vendor._id,
        name: vendor.name,
        address: vendor.address || 'Address not available',
        phone: vendor.phone || 'Phone not available',
        email: vendor.email || 'Email not available',
        // Generate coordinates around Sri Lanka for demo purposes
        lat: 6.9271 + (Math.random() - 0.5) * 0.1,
        lng: 79.8612 + (Math.random() - 0.5) * 0.1,
        type: 'Service Center'
      }));
      setServiceCenters(centersWithCoords);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching service centers:', error);
      // Fallback data if API fails
      setServiceCenters([
        {
          id: '1',
          name: 'Colombo Bike Service Center',
          address: '123 Main Street, Colombo',
          phone: '+94 11 234 5678',
          email: 'colombo@bikeservice.com',
          lat: 6.9271,
          lng: 79.8612,
          type: 'Service Center'
        },
        {
          id: '2',
          name: 'Galle Motorcycle Service',
          address: '456 Beach Road, Galle',
          phone: '+94 91 234 5678',
          email: 'galle@bikeservice.com',
          lat: 6.0480,
          lng: 80.2181,
          type: 'Service Center'
        },
        {
          id: '3',
          name: 'Kandy Bike Workshop',
          address: '789 Hill Street, Kandy',
          phone: '+94 81 234 5678',
          email: 'kandy@bikeservice.com',
          lat: 7.2906,
          lng: 80.6337,
          type: 'Service Center'
        }
      ]);
      setLoading(false);
    }
  };

  const handleCenterSelect = (center) => {
    navigate('/Services/BikeServiceSchedule', {
      state: { selectedServiceCenter: center }
    });
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const sortedCenters = [...serviceCenters].sort((a, b) => {
    if (!userLocation) return 0;
    const distanceA = calculateDistance(userLocation.lat, userLocation.lng, a.lat, a.lng);
    const distanceB = calculateDistance(userLocation.lat, userLocation.lng, b.lat, b.lng);
    return distanceA - distanceB;
  });

  if (loading) {
    return (
      <div className="google-map-container">
        <div className="loading">Loading service centers...</div>
      </div>
    );
  }

  return (
    <div className="google-map-container">
      <div className="map-header">
        <h2>Bike Service Centers Near You</h2>
        <button 
          className="back-button"
          onClick={() => navigate('/Services/BikeServiceSchedule')}
        >
          ← Back to Schedule
        </button>
      </div>

      <div className="map-content">
        <div className="map-sidebar">
          <h3>Service Centers</h3>
          {userLocation && (
            <div className="user-location">
              <strong>Your Location:</strong> 
              {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
            </div>
          )}
          
          <div className="centers-list">
            {sortedCenters.map((center, index) => {
              const distance = userLocation 
                ? calculateDistance(userLocation.lat, userLocation.lng, center.lat, center.lng)
                : null;
              
              return (
                <div key={center.id} className="center-card">
                  <h4>{center.name}</h4>
                  <p><strong>Address:</strong> {center.address}</p>
                  <p><strong>Phone:</strong> {center.phone}</p>
                  <p><strong>Email:</strong> {center.email}</p>
                  {distance && (
                    <p><strong>Distance:</strong> {distance.toFixed(2)} km</p>
                  )}
                  <button 
                    className="select-center-btn"
                    onClick={() => handleCenterSelect(center)}
                  >
                    Select This Center
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="map-display">
          <div className="map-placeholder">
            <h3>Google Maps Integration</h3>
            <p>This would display an interactive Google Map showing all service centers.</p>
            <p>To implement full Google Maps functionality, you would need:</p>
            <ul>
              <li>Google Maps API key</li>
              <li>@googlemaps/js-api-loader package</li>
              <li>Proper API billing setup</li>
            </ul>
            <div className="map-mockup">
              <div className="map-mockup-content">
                <h4>Interactive Map Area</h4>
                <p>Service centers would be displayed as markers here</p>
                <div className="mockup-markers">
                  {sortedCenters.slice(0, 3).map((center, index) => (
                    <div key={center.id} className="mockup-marker">
                      📍 {center.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GoogleServiceMap;
