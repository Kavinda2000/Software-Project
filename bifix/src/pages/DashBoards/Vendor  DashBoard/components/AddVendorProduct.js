// components/AddVendorProduct.js
import { useState } from 'react';
import axios from 'axios';

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
  data.append('owner', user.email || user.name);

  if (formData.imageFile) {
    data.append('image', formData.imageFile);
  } else if (formData.imageUrl) {
    data.append('imageUrl', formData.imageUrl);
  }

  try {
    const res = await axios.post('http://localhost:5000/api/products', data, {
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
    onProductAdded();
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