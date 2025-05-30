import React, { useState } from 'react';
import './partsform.css';
import axios from 'axios'; // Import Axios
import { toast, ToastContainer } from 'react-toastify';  // Import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import styles for react-toastify

function PartsForm({ onClose, user}) {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    brand: '',
    category: '',
    imageFile: null,
    imageUrl: '',
    warranty: '',
    reviews: '',
    owner: user?.email || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await axios.post('http://localhost:5000/api/products', formData);

    // Show a success toast if the product is created successfully
    toast.success('Product created successfully!', {
      position: 'top-right',
      autoClose: 3000,
    });

    // Close the modal after a short delay
    setTimeout(() => {
      onClose();
    }, 3000);
  } catch (error) {
    if (error.response && error.response.status === 409) {
      // Show an error toast for duplicate product
      toast.error(error.response.data.message, {
        position: 'top-right',
        autoClose: 3000,
      });
    } else if (error.response && error.response.status === 400) {
      // Show an error toast for missing fields
      toast.error(error.response.data.message, {
        position: 'top-right',
        autoClose: 3000,
      });
    } else {
      // Show a generic error toast for other errors
      toast.error('Error creating product!', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  }
};

  return (
    <div className="form-overlay">
      <ToastContainer /> {/* Add ToastContainer here */}
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
            <label htmlFor="price">Price (in $)</label>
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
            <label htmlFor="image">Image URL</label>
            <input
              type="text"
              id="image"
              name="image"
              placeholder="Image URL"
              onChange={handleChange}
              value={formData.image}
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
