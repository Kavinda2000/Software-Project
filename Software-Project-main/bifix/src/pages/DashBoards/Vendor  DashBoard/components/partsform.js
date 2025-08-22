import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './partsform.css';

function PartsForm({ onClose, user }) {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    brand: '',
    category: '',
    owner: user?.email || '',
  });

  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
  const { name, value, files } = e.target;
  if (name === 'imageFile') {
    setImageFile(files[0]);
  } else {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      toast.error('Please upload an image file!', { autoClose: 3000 });
      return;
    }

    try {
      const formDataToSend = new FormData();

      // Append form fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      // Append image file
      formDataToSend.append('image', imageFile);  // ✅ must be 'image'

      await axios.post('http://localhost:5000/api/products', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Product created successfully!', { autoClose: 3000 });
      setTimeout(() => onClose(), 3000);
    } catch (error) {
      console.error(error);
      toast.error('Error creating product!', { autoClose: 3000 });
    }
  };


  return (
    <div className="form-overlay">
      <ToastContainer />
      <div className="form-container">
        <h2>Publish a Product</h2>
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Title"
              onChange={handleChange}
              value={formData.title}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Price (in Rs)</label>
            <input
              type="number"
              id="price"
              name="price"
              placeholder="Price"
              onChange={handleChange}
              value={formData.price}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="brand">Brand</label>
            <select
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              required
            >
              <option value="">Select Brand</option>
              <option value="Honda">Honda</option>
              <option value="Yamaha">Yamaha</option>
              <option value="TVS">TVS</option>
              <option value="Bajaj">Bajaj</option>
              <option value="Hero">Hero</option>
              <option value="Suzuki">Suzuki</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              <option value="Tire">Tire</option>
              <option value="Brake Pads">Brake Pads</option>
              <option value="Oil">Oil</option>
              <option value="Battery">Battery</option>
              <option value="Chain">Chain</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="imageFile">Upload Image</label>
            <input
              type="file"
              id="imageFile"
              name="imageFile"
              accept="image/*"
              onChange={handleChange}
              required
            />

          </div>

          <div className="form-group">
            <label htmlFor="warranty">Warranty</label>
            <input
              type="text"
              id="warranty"
              name="warranty"
              placeholder="Warranty"
              onChange={handleChange}
              value={formData.warranty}
              required
            />
          </div>

          <div className="form-buttons">
            <button type="submit">Submit</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PartsForm;
