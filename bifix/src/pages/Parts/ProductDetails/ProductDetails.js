import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        const data = await res.json();
        if (data.success) {
          setProduct(data.data);
        } else {
          console.log('Product not found:', data);
        }
      } catch (err) {
        console.error('Error fetching product:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    navigate(`/Parts/Checkout/${product._id}`, {
      state: {
        product: product, // Pass product data to checkout
        quantity: 1       // Default quantity
      }
    });
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="product-details-container">
      <div className="product-details-content">
        <img src={product.image} alt={product.title} className="product-details-image" />
        <div className="product-details-info">
          <h2 className="product-details-title">{product.title}</h2>
          <p className="product-details-brand">Brand: {product.brand}</p>
          <p className="product-details-warranty">Warranty: {product.warranty}</p>
          <p className="product-details-owner">Owner: {product.owner}</p>
          <p className="product-details-price">Price: Rs. {product.price}</p>

          <button className="button-87" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
