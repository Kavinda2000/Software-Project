import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import './partsform.css'; // unique CSS file

function PartsForm({ onClose, user }) {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    brand: '',
    category: '',
    warranty: '',
    owner: user?.email || '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'pf-imageFile') {
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

    setProcessing(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      data.append("image", imageFile);

      await axios.post("http://localhost:5000/api/products", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Product created successfully!", { autoClose: 2000 });

      setTimeout(() => {
        setProcessing(false);
        navigate("/parts");
      }, 2000);

    } catch (error) {
      console.error(error);
      toast.error("Error creating product!", { autoClose: 3000 });
      setProcessing(false);
    }
  };

  return (
    <div className="pf-overlay">
      <ToastContainer position="bottom-right" />
      {processing && (
        <div className="pf-processing-overlay">
          <div className="pf-spinner"></div>
          <p>Publishing...</p>
        </div>
      )}

      <div className="pf-container">
        <h2 className="pf-title">Publish a Product</h2>
        <form onSubmit={handleSubmit} className="pf-form-grid">
          <div className="pf-form-group">
            <label htmlFor="pf-title">Title</label>
            <input
              type="text"
              id="pf-title"
              name="title"
              placeholder="Title"
              onChange={handleChange}
              value={formData.title}
              required
            />
          </div>

          <div className="pf-form-group">
            <label htmlFor="pf-price">Price (in Rs)</label>
            <input
              type="number"
              id="pf-price"
              name="price"
              placeholder="Price"
              onChange={handleChange}
              value={formData.price}
              required
            />
          </div>

          <div className="pf-form-group">
            <label htmlFor="pf-brand">Brand</label>
            <select
              id="pf-brand"
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

          <div className="pf-form-group">
            <label htmlFor="pf-category">Category</label>
            <select
              id="pf-category"
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

          <div className="pf-form-group">
            <label htmlFor="pf-imageFile">Upload Image</label>
            <input
              type="file"
              id="pf-imageFile"
              name="pf-imageFile"
              accept="image/*"
              onChange={handleChange}
              required
            />
          </div>

          <div className="pf-form-group">
            <label htmlFor="pf-warranty">Warranty</label>
            <input
              type="text"
              id="pf-warranty"
              name="warranty"
              placeholder="Warranty"
              onChange={handleChange}
              value={formData.warranty}
              required
            />
          </div>

          <div className="pf-form-buttons">
            <button type="submit">Submit</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PartsForm;
