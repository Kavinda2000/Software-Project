// components/UpdateServiceForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './UpdateServiceForm.css';
import MapPicker from '../Map/MapPicker';

const SERVER_URL = 'http://localhost:5000/';

function UpdateServiceForm({ service, onClose, onUpdated }) {
  const [location, setLocation] = useState(service.location || null);
  const [showMapPicker, setShowMapPicker] = useState(false);

  const [formData, setFormData] = useState({
    name: service.name || '',
    testType: service.testType || 'Bike Repair',
    address: service.address || '',
    price: service.price || '',
    timeSlots: service.timeSlots?.map(ts => {
      const [startTime, endTime] = ts.slot ? ts.slot.split(" - ") : ["", ""];
      return {
        date: ts.date ? ts.date.split("T")[0] : "",
        startTime,
        endTime,
      };
    }) || [],
  });

  const [slot, setSlot] = useState({ date: '', startTime: '', endTime: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSlotChange = (index, field, value) => {
    const newSlots = [...formData.timeSlots];
    newSlots[index][field] = value;
    setFormData(prev => ({ ...prev, timeSlots: newSlots }));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      location, // include the selected location
      timeSlots: formData.timeSlots.map(ts => ({
        date: new Date(ts.date),
        slot: `${ts.startTime} - ${ts.endTime}`,
        booked: false,
      }))
    };

  try {
    await axios.put(`${SERVER_URL}api/tests/${service._id}`, payload);
    toast.success('Service updated successfully!', { autoClose: 2000 });
    setTimeout(() => {
      onUpdated(payload); // pass the updated service object here
      onClose();
    }, 2000);
  } catch (error) {
    console.error(error);
    toast.error('Error updating service!', { autoClose: 3000 });
  }
  };

  return (
    <div className="form-overlay">
      
      {showMapPicker && (
        <MapPicker
          location={location}
          setLocation={setLocation}
          onClose={() => setShowMapPicker(false)}
        />
      )}
      <div className="form-container">
        <h2>Update Service</h2>
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-row">
            <div className="form-group">
              <label>Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Type</label>
              <select name="testType" value={formData.testType} onChange={handleChange}>
                <option value="Bike Repair">Bike Repair</option>
                <option value="Bike Service">Bike Service</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
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

            <div className="form-group">
              <label>Price (optional)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} />
            </div>
          </div>

          {/* Time slots */}
          <div className="form-row">
            <div className="form-group slots-column">
              <label>Time Slots</label>
              {formData.timeSlots.map((ts, index) => (
                <div key={index} className="slot-item">
                  <input type="date" value={ts.date} onChange={(e) => handleSlotChange(index, 'date', e.target.value)} />
                  <input type="time" value={ts.startTime} onChange={(e) => handleSlotChange(index, 'startTime', e.target.value)} />
                  <input type="time" value={ts.endTime} onChange={(e) => handleSlotChange(index, 'endTime', e.target.value)} />
                  <button type="button" onClick={() => removeSlot(index)}>Remove</button>
                </div>
              ))}
              <div className="add-slot-row">
                <input type="date" value={slot.date} onChange={(e) => setSlot(prev => ({...prev, date: e.target.value}))} />
                <input type="time" value={slot.startTime} onChange={(e) => setSlot(prev => ({...prev, startTime: e.target.value}))} />
                <input type="time" value={slot.endTime} onChange={(e) => setSlot(prev => ({...prev, endTime: e.target.value}))} />
                <button type="button" onClick={addSlot}>Add</button>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Owner</label>
              <input type="text" value={service.owner} disabled />
            </div>
          </div>

          <div className="form-buttons">
            <button type="submit">Update</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateServiceForm;
