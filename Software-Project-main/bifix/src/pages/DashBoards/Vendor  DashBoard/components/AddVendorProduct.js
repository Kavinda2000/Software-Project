// components/AddVendorProduct.js
import { useState } from 'react';
import axios from 'axios';
import './Vendorproduct.css'; // use the same style if you want consistency

const AddVendorProduct = ({ user, onProductAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    price: '',
    warranty: '',
    reviews: '',
    imageUrl: '',
    imageFile: null,
  });


  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    data.append('title', formData.title);
    data.append('brand', formData.brand);
    data.append('price', formData.price);
    data.append('warranty', formData.warranty);
    data.append('reviews', formData.reviews);
    data.append('owner', user.email || user.name);

    // Either image file or image URL
    if (formData.imageFile) {
      data.append('image', formData.imageFile); // backend should handle file
    } else {
      data.append('imageUrl', formData.imageUrl); // or image from URL
    }

    try {
      await axios.post('http://localhost:5000/api/products', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Product added!');
      setFormData({
        title: '',
        brand: '',
        price: '',
        warranty: '',
        reviews: '',
        imageUrl: '',
        imageFile: null,
      });
      onProductAdded(); // Refresh product list in VendorProductList
    } catch (err) {
      console.error('Error adding product:', err);
    }
  };

  return (
    <form className="vendor-product-form" onSubmit={handleSubmit} encType="multipart/form-data">
    </form>
  );
};

export default AddVendorProduct;
