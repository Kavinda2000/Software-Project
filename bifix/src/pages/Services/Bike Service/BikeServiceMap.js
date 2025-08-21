import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './BikeServiceMap.css';

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
  const [bikeServiceCenters, setBikeServiceCenters] = useState([
    { lat: 6.9271, lon: 79.8612, name: "Colombo Bike Repair Center", type: "Repair" },
    { lat: 6.0480, lon: 80.2181, name: "Galle Bike Repair Shop", type: "Repair" },
    { lat: 6.5244, lon: 79.9577, name: "Dehiwala Motorcycle Service", type: "Repair" },
    { lat: 6.9271, lon: 79.8612, name: "Mount Lavinia Bike Center", type: "Repair" },
  ]);

  // Get user location
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

  return (
    <div className="map-container">
      <div className="map-header">
        <h2>Bike Repair Centers Near You</h2>
        <button 
          className="back-button"
          onClick={() => navigate("/Services/BikeRepairSchedule")}
        >
          ← Back to Schedule
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

        {bikeServiceCenters.map((center, index) => (
          <Marker key={index} position={[center.lat, center.lon]} icon={customIcon}>
            <Popup>
              <div>
                <h4>{center.name}</h4>
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
