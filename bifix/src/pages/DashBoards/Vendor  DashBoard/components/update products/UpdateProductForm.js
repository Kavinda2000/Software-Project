import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './UpdateProductForm.css'; // ✅ separate CSS

const SERVER_URL = 'http://localhost:5000/';

function UpdateProductForm({ product, onClose, onUpdated }) {
  const [formData, setFormData] = useState({
    title: product.title || '',
    price: product.price || '',
    warranty: product.warranty || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${SERVER_URL}api/products/${product._id}`, formData);
      toast.success('Product updated successfully!', { autoClose: 2000 });
      setTimeout(() => {
        onUpdated();
        onClose();
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error('Error updating product!', { autoClose: 3000 });
    }
  };

  return (
    <div className="upf-overlay">
      <ToastContainer position="bottom-right" />
      <div className="upf-container">
        <h2>Update Product</h2>
        <form onSubmit={handleSubmit} className="upf-form-grid">
          <div className="upf-form-group">
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

          <div className="upf-form-group">
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

          <div className="upf-form-group">
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

          {/* Disabled fields */}
          <div className="upf-form-group">
            <label>Brand</label>
            <input type="text" value={product.brand} disabled />
          </div>

          <div className="upf-form-group">
            <label>Category</label>
            <input type="text" value={product.category} disabled />
          </div>

          <div className="upf-form-group">
            <label>Owner</label>
            <input type="text" value={product.owner} disabled />
          </div>

          <div className="upf-form-buttons">
            <button type="submit">Update</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateProductForm;
