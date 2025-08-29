// components/TestForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './TestForm.css';
import MapPicker from './Map/MapPicker';

const SERVER_URL = 'http://localhost:5000/api/';

function TestForm({ onClose, user, onTestAdded }) {
  const [showMapPicker, setShowMapPicker] = useState(false);  
  const [location, setLocation] = useState(null); // separate state
    const [formData, setFormData] = useState({
      name: '',
      testType: 'Bike Repair',
      price: '',
      owner: user?.email || '',
      timeSlots: [],
    });
  const [slot, setSlot] = useState({ date: '', startTime: '', endTime: '' });
  const [processing, setProcessing] = useState(false);

  const addSlot = () => {
    if (!slot.date || !slot.startTime || !slot.endTime) {
      toast.error("Please fill all fields for the time slot");
      return;
    }
    setFormData(prev => ({
      ...prev,
      timeSlots: [...prev.timeSlots, slot]
    }));
    setSlot({ date: '', startTime: '', endTime: '' });
  };

  const removeSlot = (index) => {
    setFormData(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.filter((_, i) => i !== index)
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSlotChange = (e) => {
    const { name, value } = e.target;
    setSlot(prev => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  // Validation: ensure at least one time slot
  if (formData.timeSlots.length === 0) {
    toast.error("Please add at least one time slot");
    return;
  }

  // Validation: ensure location is selected
  if (!location) {
    toast.error("Please select a location on the map");
    return;
  }

  setProcessing(true);

  try {
    // Transform timeSlots to backend format
    const transformedSlots = formData.timeSlots.map(ts => ({
      date: new Date(ts.date),
      slot: `${ts.startTime} - ${ts.endTime}`,
    }));

    // Prepare data to send
    const dataToSend = {
      ...formData,
      price: formData.price ? Number(formData.price) : 0,
      timeSlots: transformedSlots,
      location: location, // include lat/lng from MapPicker
    };

    // Send POST request
    await axios.post(`${SERVER_URL}tests`, dataToSend);

const toastId = toast.success("Test published successfully!", { autoClose: 2000 });

setTimeout(() => {
  setProcessing(false);
  onClose();
  toast.dismiss(toastId); // manually dismiss
}, 2000);

  } catch (err) {
    console.error("Error publishing test:", err);
    toast.error("Error publishing test!", { autoClose: 3000 });
    setProcessing(false);
  }
};


  return (
    <div className="testform-overlay">
        {showMapPicker && (
          <MapPicker
            location={location}
            setLocation={setLocation}
            onClose={() => setShowMapPicker(false)} // <-- this is passed here
          />
        )}
      {processing && (
        <div className="testform-processing-overlay">
          <div className="testform-spinner"></div>
          <p>Publishing...</p>
        </div>
      )}
      <div className="testform-container">
        <h2>Publish a Service</h2>
        <form onSubmit={handleSubmit} className="testform-grid">
          <div className="testform-group">
            <label>Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="testform-group">
            <label>Type</label>
            <select name="testType" value={formData.testType} onChange={handleChange}>
              <option value="Bike Repair">Bike Repair</option>
              <option value="Bike Service">Bike Service</option>
            </select>
          </div>

          <div className="testform-group">
            <label>Location</label>
            {location ? (
              <div>
                <p>Lat: {location.lat}, Lng: {location.lng}</p>
                <button type="button" onClick={() => setShowMapPicker(true)}>Change Location</button>
              </div>
            ) : (
              <button type="button" onClick={() => setShowMapPicker(true)}>Select Location</button>
            )}
          </div>

          <div className="testform-group">
            <label>Price (optional)</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} />
          </div>

          <div className="testform-group time-slots">
            <label>Time Slots</label>
            <div className="time-slot-inputs">
              <input type="date" name="date" value={slot.date} onChange={handleSlotChange} />
              <input type="time" name="startTime" value={slot.startTime} onChange={handleSlotChange} />
              <input type="time" name="endTime" value={slot.endTime} onChange={handleSlotChange} />
              <button type="button" onClick={addSlot}>Add</button>
            </div>
            <ul className="time-slot-list">
              {formData.timeSlots.map((ts, i) => (
                <li key={i}>
                  {ts.date} | {ts.startTime} - {ts.endTime}
                  <button type="button" onClick={() => removeSlot(i)}>Remove</button>
                </li>
              ))}
            </ul>
          </div>

          <div className="testform-buttons">
            <button type="submit">Publish</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TestForm;
