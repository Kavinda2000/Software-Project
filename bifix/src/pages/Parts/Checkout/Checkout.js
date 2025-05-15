import React, { useState, useEffect } from "react";
import "./Checkout.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams, useLocation } from "react-router-dom";


const Checkout = () => {
  const { id } = useParams();
  const location = useLocation();
  const [product, setProduct] = useState(location.state?.product || null);
  const initialQuantity = location.state?.quantity || 1;
  const [quantity, setQuantity] = useState(initialQuantity);
  const [loading, setLoading] = useState(!location.state?.product);
 
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


  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    paymentMethod: "credit-card",
    creditCardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQuantityChange = (e) => {
    const value = Math.max(1, parseInt(e.target.value) || 1);
    setQuantity(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const requiredFields = ["fullName", "email", "phone", "address", "city", "zip"];
    if (formData.paymentMethod === "credit-card") {
      requiredFields.push("creditCardNumber", "expiryDate", "cvv");
    }

    const isEmptyField = requiredFields.some((field) => !formData[field].trim());

    if (isEmptyField) {
      toast.error("Please fill in all required fields.", { position: "top-center", autoClose: 5000 });
      return;
    }

    toast.success("Order placed successfully!", { position: "top-center", autoClose: 5000 });
  };


  // Loading or product not found
  if (loading) {
    return <div className="p-4 text-blue-600">Loading product...</div>;
  }

  if (!product) {
    return <div className="p-4 text-red-600">Product not found</div>;
  }

  // Calculate totals
  const subtotal = product.price * quantity;
  const shipping = 300;
  const total = subtotal + shipping;

  return (
    <div className="checkout-background">
      <div className="checkout-wrapper">
        {/* Left Side - Form */}
        <div className="checkout-left">
          <h2 className="checkout-title">Checkout</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="check-label">Full Name</label>
              <input
                className="check-input"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </div>

            <div className="checkout-row">
              <div className="form-group">
                <label className="check-label">Email Address</label>
                <input
                  className="check-input"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              </div>
              <div className="form-group">
                <label className="check-label">Phone Number</label>
                <input
                  className="check-input"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="check-label">Shipping Address</label>
              <input
                className="check-input"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your shipping address"
              />
            </div>

            <div className="checkout-row">
              <div className="form-group">
                <label className="check-label">City</label>
                <input
                  className="check-input"
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter your city"
                />
              </div>
              <div className="form-group">
                <label className="check-label">Postal Code</label>
                <input
                  className="check-input"
                  type="text"
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  placeholder="Enter your postal code"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="check-label">Payment Method</label>
              <select
                className="check-input"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
              >
                <option value="credit-card">Credit Card</option>
                <option value="paypal">Cash On Delivery</option>
              </select>
            </div>

            {formData.paymentMethod === "credit-card" && (
              <>
                <div className="form-group">
                  <label className="check-label">Credit Card Number</label>
                  <input
                    className="check-input"
                    type="text"
                    name="creditCardNumber"
                    value={formData.creditCardNumber}
                    onChange={handleChange}
                    placeholder="Enter your credit card number"
                  />
                </div>

                <div className="checkout-row">
                  <div className="form-group">
                    <label className="check-label">Expiry Date</label>
                    <input
                      className="check-input"
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      placeholder="MM/YY"
                    />
                  </div>
                  <div className="form-group">
                    <label className="check-label">CVV</label>
                    <input
                      className="check-input"
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      placeholder="Enter your CVV"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Quantity Selection */}
            <div className="form-group">
              <label className="check-label">Quantity</label>
              <input
                className="check-input"
                type="number"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
              />
            </div>

            <button type="submit" className="checkout-button">
              Place Order
            </button>
          </form>
        </div>

        {/* Right Side - Summary */}
        <div className="checkout-right">
          <h2 className="right">Order Summary</h2>
          <p className="right-p">Subtotal ({quantity} item{quantity > 1 ? 's' : ''}): Rs. {subtotal}</p>
          <p>Shipping: Rs. {shipping}</p>
          <p className="right-ps"><strong>Total: Rs. {total}</strong></p>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Checkout;
