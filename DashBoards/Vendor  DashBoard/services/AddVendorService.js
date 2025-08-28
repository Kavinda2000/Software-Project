import { useState } from 'react';
import axios from 'axios';

const SERVER_URL = 'http://localhost:5000/api/';

const AddVendorService = ({ user, onServiceAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    testType: 'Bike Repair',
    address: '',
    price: '',
    timeSlots: [], // { date, startTime, endTime }
  });

  const [slot, setSlot] = useState({ date: '', startTime: '', endTime: '' });

  // Add a time slot
  const addSlot = () => {
    if (!slot.date || !slot.startTime || !slot.endTime) return alert('Fill all time slot fields');
    setFormData(prev => ({ ...prev, timeSlots: [...prev.timeSlots, slot] }));
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
    if (formData.timeSlots.length === 0) return alert('Add at least one time slot');

    try {
      await axios.post(`${SERVER_URL}tests`, {
        ...formData,
        owner: user.email || user.name
      });
      alert('Service added!');
      setFormData({
        name: '',
        testType: 'Bike Repair',
        address: '',
        price: '',
        timeSlots: [],
      });
      setSlot({ date: '', startTime: '', endTime: '' });
      onServiceAdded(); // Refresh list
    } catch (err) {
      console.error('Error adding service:', err);
      alert('Failed to add service');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="vendor-service-form">
      <div>
        <label>Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
      </div>

      <div>
        <label>Type</label>
        <select name="testType" value={formData.testType} onChange={handleChange}>
          <option value="Bike Repair">Bike Repair</option>
          <option value="Bike Service">Bike Service</option>
        </select>
      </div>

      <div>
        <label>Address</label>
        <input type="text" name="address" value={formData.address} onChange={handleChange} required />
      </div>

      <div>
        <label>Price</label>
        <input type="number" name="price" value={formData.price} onChange={handleChange} />
      </div>

      <div>
        <label>Time Slots</label>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <input type="date" name="date" value={slot.date} onChange={handleSlotChange} />
          <input type="time" name="startTime" value={slot.startTime} onChange={handleSlotChange} />
          <input type="time" name="endTime" value={slot.endTime} onChange={handleSlotChange} />
          <button type="button" onClick={addSlot}>Add</button>
        </div>
        <ul>
          {formData.timeSlots.map((ts, i) => (
            <li key={i}>
              {ts.date} | {ts.startTime} - {ts.endTime}
              <button type="button" onClick={() => removeSlot(i)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>

      <button type="submit">Add Service</button>
    </form>
  );
};

export default AddVendorService;
