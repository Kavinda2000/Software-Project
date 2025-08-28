import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './GoogleServiceMap.css';

function GoogleServiceMap() {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [serviceCenters, setServiceCenters] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Load Google Maps JS if not present
    if (!window.google) {
      const script = document.createElement('script');
      const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setMapLoaded(true);
      script.onerror = () => console.error('Failed to load Google Maps API');
      document.head.appendChild(script);
    } else {
      setMapLoaded(true);
    }

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        () => setUserLocation({ lat: 6.9271, lng: 79.8612 })
      );
    } else {
      setUserLocation({ lat: 6.9271, lng: 79.8612 });
    }

    // Fetch service centers from backend
    fetchServiceCenters();
  }, []);

  const fetchServiceCenters = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/vendors');
      const centersWithCoords = response.data.map((vendor, index) => ({
        id: vendor._id,
        name: vendor.name,
        address: vendor.address || 'Address not available',
        phone: vendor.phone || 'Phone not available',
        email: vendor.email || 'Email not available',
        lat: 6.9271 + (Math.random() - 0.5) * 2.0,
        lng: 79.8612 + (Math.random() - 0.5) * 2.0,
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

  useEffect(() => {
    if (mapLoaded && serviceCenters.length > 0 && userLocation && mapRef.current) {
      initializeMap();
    }
  }, [mapLoaded, serviceCenters, userLocation]);

  const initializeMap = () => {
    if (!window.google || !mapRef.current) return;

    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 8,
      center: userLocation,
      mapTypeId: 'roadmap',
      styles: [{ featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] }]
    });

    mapInstanceRef.current = map;

    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    if (userLocation) {
      const userMarker = new window.google.maps.Marker({
        position: userLocation,
        map,
        title: 'Your Location'
      });
      markersRef.current.push(userMarker);
    }

    serviceCenters.forEach((center) => {
      const marker = new window.google.maps.Marker({ position: { lat: center.lat, lng: center.lng }, map, title: center.name });
      const distance = userLocation ? calculateDistance(userLocation.lat, userLocation.lng, center.lat, center.lng) : null;
      const infoWindow = new window.google.maps.InfoWindow({
        content: `<div style="padding: 8px; font-family: Arial, sans-serif; max-width: 280px;">
            <h3 style="margin: 0 0 8px 0; color: #ea4335;">${center.name}</h3>
            <p style="margin: 4px 0; color: #666;"><strong>Address:</strong> ${center.address}</p>
            <p style="margin: 4px 0; color: #666;"><strong>Phone:</strong> ${center.phone}</p>
            <p style="margin: 4px 0; color: #666;"><strong>Email:</strong> ${center.email}</p>
            ${distance ? `<p style="margin: 4px 0; color: #666;"><strong>Distance:</strong> ${distance.toFixed(2)} km</p>` : ''}
          </div>`
      });
      marker.addListener('click', () => infoWindow.open(map, marker));
      markersRef.current.push(marker);
    });

    const bounds = new window.google.maps.LatLngBounds();
    if (userLocation) bounds.extend(userLocation);
    serviceCenters.forEach(center => bounds.extend({ lat: center.lat, lng: center.lng }));
    map.fitBounds(bounds);
  };

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
          {!mapLoaded ? (
            <div className="map-loading">
              <h3>Loading Google Maps...</h3>
              <p>Please wait while we load the interactive map.</p>
            </div>
          ) : (
            <div ref={mapRef} className="google-map" style={{ width: '100%', height: '100%', minHeight: '500px' }} />
          )}
        </div>
      </div>
    </div>
  );
}

export default GoogleServiceMap;
