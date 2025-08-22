import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './BikeServiceMap.css';
import axios from 'axios';

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Marker icon customization
const customIcon = new L.Icon({
  iconUrl: "https://cdn.iconscout.com/icon/free/png-256/bike-1138487.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

function BikeServiceMap() {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState(null);
  const [vendorCenters, setVendorCenters] = useState([]);

  // Get user location
  useEffect(() => {
    document.body.classList.add('map-dark-page');
    return () => document.body.classList.remove('map-dark-page');
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }, []);

  // Load nearby vendors from backend when location available
  useEffect(() => {
    const fetchNearby = async () => {
      try {
        if (!userLocation) return;
        const [lat, lon] = userLocation;
        const res = await axios.get(`http://localhost:5000/api/vendors/near?latitude=${lat}&longitude=${lon}&radiusMeters=15000`);
        const centers = (res.data || [])
          .filter(v => typeof v.latitude === 'number' && typeof v.longitude === 'number')
          .map(v => ({
            lat: v.latitude,
            lon: v.longitude,
            name: v.name || 'Vendor',
            address: v.address || '',
            type: 'Vendor'
          }));
        setVendorCenters(centers);
      } catch (e) {
        console.log('Failed to load nearby vendors', e);
        setVendorCenters([]);
      }
    };
    fetchNearby();
  }, [userLocation]);

  return (
    <div className="map-container">
      <div className="map-header">
        <h2>Bike Repair Centers Near You</h2>
        <button 
          className="back-button"
          onClick={() => navigate("/services")}
        >
          ← Back to Services
        </button>
      </div>
      <MapContainer 
        center={userLocation || [6.9271, 79.8612]} 
        zoom={12} 
        style={{ height: '500px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {userLocation && (
          <Marker position={userLocation} icon={customIcon}>
            <Popup>You are here!</Popup>
          </Marker>
        )}

        {vendorCenters.map((center, index) => (
          <Marker key={index} position={[center.lat, center.lon]} icon={customIcon}>
            <Popup>
              <div>
                <h4>{center.name}</h4>
                {center.address && <p>{center.address}</p>}
                <p>Type: {center.type}</p>
                <button 
                  onClick={() => navigate("/Services/BikeRepairSchedule")}
                  style={{ 
                    background: '#007bff', 
                    color: 'white', 
                    border: 'none', 
                    padding: '5px 10px', 
                    borderRadius: '3px',
                    cursor: 'pointer'
                  }}
                >
                  Schedule Repair
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default BikeServiceMap;
