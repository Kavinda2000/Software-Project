import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import "react-toastify/dist/ReactToastify.css";
import "./Checkout.css";

const stripePromise = loadStripe("pk_test_51RA7nMQmAyVY8htLR2NNZpaafTitjhzaqKRbipejEibZYMDNIrNviwBiaeEKkRI4IM3OciFVWAZjrCPHUAWMm15j00dq9rgkST");

const Checkout = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [product, setProduct] = useState(location.state?.product || null);
  const [quantity, setQuantity] = useState(location.state?.quantity || 1);
  const [loading, setLoading] = useState(!location.state?.product);
  const [processing, setProcessing] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    paymentMethod: "Cash On Delivery",
  });

  useEffect(() => {
    if (product) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        const data = await res.json();
        if (data.success) setProduct(data.data);
        else toast.error("Product not found");
      } catch (err) {
        toast.error("Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, product]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleQuantityChange = (e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = ["fullName", "email", "phone", "address", "city", "zip"];
    if (requiredFields.some((field) => !formData[field].trim())) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setProcessing(true);

      if (formData.paymentMethod === "Credit Card") {
        // Stripe flow
        const stripe = await stripePromise;
        const response = await fetch("http://localhost:5000/api/checkout/create-checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product._id, quantity }),
        });
        const session = await response.json();
        if (session.url) {
          window.location.href = session.url; // redirect to Stripe checkout
        } else {
          toast.error("Failed to create checkout session");
          setProcessing(false);
        }
        return;
      }

      // Cash On Delivery flow
      const orderResponse = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: formData.email,
          products: [{ productId: product._id, quantity }],
          address: `${formData.address}, ${formData.city}, ${formData.zip}`,
          paymentMethod: "Cash on Delivery",
        }),
      });
      const orderResult = await orderResponse.json();
      if (!orderResult.success) {
        toast.error(orderResult.message || "Failed to place order");
        setProcessing(false);
        return;
      }

      toast.success("Order placed successfully!");
      setTimeout(() => {
        setProcessing(false);
        navigate("/parts");
      }, 1500);

    } catch (err) {
      toast.error("Error during checkout: " + err.message);
      setProcessing(false);
    }
  };

  if (loading) return <div className="p-4 text-blue-600">Loading product...</div>;
  if (!product) return <div className="p-4 text-red-600">Product not found</div>;

  const subtotal = product.price * quantity;
  const shipping = 300;
  const total = subtotal + shipping;

  return (
    <div className="checkout-background">
      <div className="checkout-wrapper">
        <div className="checkout-left">
          <h2 className="checkout-title">Checkout</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} />
            </div>
            <div className="checkout-row">
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} />
            </div>
            <div className="checkout-row">
              <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" />
              <input type="text" name="zip" value={formData.zip} onChange={handleChange} placeholder="Postal Code" />
            </div>
            <div className="form-group">
              <label>Payment Method</label>
              <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
                <option value="Cash On Delivery">Cash On Delivery</option>
                <option value="Credit Card">Credit Card</option>
              </select>
            </div>
            <div className="form-group">
              <label>Quantity</label>
              <input type="number" min="1" value={quantity} onChange={handleQuantityChange} />
            </div>
            <button type="submit" className="checkout-button">Place Order</button>
          </form>
        </div>

        <div className="checkout-right">
          <h2>Order Summary</h2>
          <p>Subtotal ({quantity} item{quantity > 1 ? "s" : ""}): Rs. {subtotal}</p>
          <p>Shipping: Rs. {shipping}</p>
          <p><strong>Total: Rs. {total}</strong></p>
        </div>
      </div>

      {processing && (
        <div className="processing-overlay">
          <div className="spinner"></div>
          <p>Processing your order...</p>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Checkout;
