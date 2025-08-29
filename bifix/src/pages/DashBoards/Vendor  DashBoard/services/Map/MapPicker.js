// components/Map/MapPicker.js
import { useState, useCallback, useRef, useEffect } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import './MapPicker.css';

const containerStyle = {
  width: "100%",
  height: "500px",
};

function MapPicker({ location, setLocation, onClose }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const [markerPos, setMarkerPos] = useState(location || { lat: 6.9271, lng: 79.8612 });
  const [showConfirm, setShowConfirm] = useState(false);
  const [tempPos, setTempPos] = useState(null);
  const searchInputRef = useRef(null);
  const mapRef = useRef(null);

  // Lock scroll when map picker is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const onMapClick = useCallback((e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    const pos = { lat, lng };
    setMarkerPos(pos);
    setTempPos(pos);
    setShowConfirm(true);
  }, []);

  const confirmLocation = () => {
    setMarkerPos(tempPos);
    setLocation(tempPos);
    setShowConfirm(false);
    if (onClose) onClose();
  };

  const cancelLocation = () => {
    setTempPos(null);
    setShowConfirm(false);
  };

  const handlePlaceChanged = () => {
    if (!mapRef.current || !searchInputRef.current) return;
    const place = searchInputRef.current.getPlace();
    if (!place || !place.geometry) return;

    const pos = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };

    setMarkerPos(pos);
    setLocation(pos);
    mapRef.current.panTo(pos);
  };

  if (!isLoaded) return <p>Loading Map...</p>;

  return (
    <div className="map-picker-overlay">
      <button className="map-close-btn-outer" onClick={onClose}>×</button>
      <div className="map-picker-container">
        <input
          type="text"
          placeholder="Search a place..."
          className="map-search-input"
          ref={searchInputRef}
        />
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={markerPos}
          zoom={15}
          onClick={onMapClick}
          onLoad={(map) => {
            mapRef.current = map;

            if (searchInputRef.current) {
              const searchBox = new window.google.maps.places.SearchBox(searchInputRef.current);
              searchBox.addListener("places_changed", handlePlaceChanged);

              // Optional: fit map to bounds of selected places
              const bounds = new window.google.maps.LatLngBounds();
              searchBox.getPlaces()?.forEach(place => {
                if (place.geometry) bounds.extend(place.geometry.location);
              });
              map.fitBounds(bounds);
            }
          }}
          options={{ fullscreenControl: false }}
        >
          <Marker position={markerPos} />
        </GoogleMap>

        {showConfirm && (
          <div className="confirmation-modal">
            <p>Do you want to select this location?</p>
            <div className="confirmation-buttons">
              <button className="yes-btn" onClick={confirmLocation}>Yes</button>
              <button className="no-btn" onClick={cancelLocation}>No</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MapPicker;
