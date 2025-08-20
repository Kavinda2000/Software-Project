import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';  // Import Leaflet for marker customization
import './BikeServiceMap.css'


// Marker icon customization
const customIcon = new L.Icon({
  iconUrl: "https://cdn.iconscout.com/icon/free/png-256/bike-1138487.png",  // Custom bike icon
  iconSize: [30, 30],
  iconAnchor: [15, 30],  // Adjust the anchor to center the icon
});

function BikeServiceMap() {
  const [userLocation, setUserLocation] = useState(null);
  const [bikeServiceCenters, setBikeServiceCenters] = useState([
    { lat: 6.9271, lon: 79.8612, name: "Colombo Bike Service" },  // Example center, replace with real data
    { lat: 6.0480, lon: 80.2181, name: "Galle Bike Shop" },
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
    <div>
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
            <Popup>{center.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default BikeServiceMap;
