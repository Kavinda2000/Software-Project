import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Vendorproduct.css'; // optional, for styling

const SERVER_URL = 'http://localhost:5000/';

const VendorProductList = ({ user, refresh }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchVendorProducts = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}api/products`);
        const allProducts = res.data.data;

        // Filter products where owner matches current user's email or name
        const userProducts = allProducts.filter(
          (product) => product.owner === user.email || product.owner === user.name
        );

        setProducts(userProducts);
      } catch (err) {
        console.error('Error fetching vendor products:', err);
      }
    };

    if (user) {
      fetchVendorProducts();
    }
  }, [user, refresh]); // also refetch on refresh toggle

  return (
    <div className="vendor-product-list">
      {products.length === 0 ? (
        <p>No products added yet.</p>
      ) : (
        products.map((product) => {
          // Fix image path: replace backslashes with slashes and add server URL prefix
          const imagePath = product.image.replace(/\\/g, '/');
          const imageUrl = `${SERVER_URL}${imagePath}`;

          return (
            <a
              key={product._id}
              href={`/product/${product._id}`}
              className="vendor-product-card"
              style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}
            >
              <img src={imageUrl} alt={product.title} className="product-img" />
              <h3>{product.title}</h3>
              <p><strong>Brand:</strong> {product.brand}</p>
              <p><strong>Price:</strong> ${product.price}</p>
              <p><strong>Warranty:</strong> {product.warranty}</p>
              {/* Assuming you removed reviews from backend, omit if no longer needed */}
              {/* <p><strong>Reviews:</strong> {product.reviews}</p> */}
            </a>
          );
        })
      )}
    </div>
  );
};

export default VendorProductList;
