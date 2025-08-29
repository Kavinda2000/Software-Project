import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './Orders.css';


function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null); // track order being cancelled
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const userData = JSON.parse(sessionStorage.getItem("userData"));
      if (!userData || !userData.email) {
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get(
          `http://localhost:5000/api/orders/user/${encodeURIComponent(userData.email)}`
        );

        if (res.data && Array.isArray(res.data.data)) {
          setOrders(res.data.data);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const handleCancel = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      setCancellingId(orderId);
      await axios.delete(`http://localhost:5000/api/orders/${orderId}`);
      setOrders(prev => prev.filter(order => order._id !== orderId));
    } catch (err) {
      console.error("Failed to cancel order:", err);
      alert("Failed to cancel order. Try again later.");
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) return <p>Loading orders...</p>;

  return (
  <div className="orders-page">
  <div className="csu-header">
    <button onClick={() => navigate('/customer-dashboard')} className="csu-back-btn">
      ← Back to Dashboard
    </button>
    <h1 className="csu-title">Your Orders</h1>
  </div>

  {loading ? (
    <p style={{textAlign:'center', color:'white'}}>Loading orders...</p>
  ) : orders.length === 0 ? (
    <p className="no-orders-text">
      You have no orders yet. Place an order now and get started!
    </p>
  ) : (
    <div className="orders-list">
      {orders.map((order) => (
        <div key={order._id} className="order-card">
          <h3>Order #{order._id}</h3>
          <p>Status: <span className={`status ${order.status.toLowerCase()}`}>{order.status}</span></p>
          <p>Total: Rs. {order.total + 300} <span className="shipping-info">(Including Rs. 300 shipping)</span></p>
          <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>

          {order.products.map((product) => (
            <div key={product.productId} className="order-product">
              <img 
                src={
                  product.image?.startsWith('uploads\\') || product.image?.startsWith('uploads/')
                    ? `http://localhost:5000/${product.image.replace(/\\/g, '/')}`
                    : product.image
                } 
                alt={product.title} 
                className="product-img"
              />
              <div className="product-info">
                <h4>{product.title}</h4>
                <p>Price: Rs. {product.price}</p>
                <p>Quantity: {product.quantity}</p>
              </div>
            </div>
          ))}

          {(order.status === "Pending" || order.status === "") && (
            <button
              className="cancel-button"
              onClick={() => handleCancel(order._id)}
              disabled={cancellingId === order._id}
            >
              {cancellingId === order._id ? "Cancelling..." : "Cancel Order"}
            </button>
          )}
        </div>
      ))}
    </div>
  )}
</div>

);
}

export default Orders;
