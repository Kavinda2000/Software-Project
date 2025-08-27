import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./VeOrders.css";

const VeOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const vendorEmail = JSON.parse(sessionStorage.getItem("userData"))?.email;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/orders/vendor/${vendorEmail}`);
        const data = await res.json();
        if (data.success) {
          setOrders(data.data);
        } else {
          toast.error("Failed to fetch orders");
        }
      } catch (err) {
        toast.error("Error fetching orders: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (vendorEmail) fetchOrders();
  }, [vendorEmail]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Order status updated");
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        toast.error("Failed to update status");
      }
    } catch (err) {
      toast.error("Error updating status: " + err.message);
    }
  };

  if (loading) return <div className="orders-loading">Loading orders...</div>;

  if (!orders.length)
  return (
    <div className="veorders-dark-background">
      <div className="veorders-container">
        <div className="orders-empty">No orders found.</div>
      </div>
    </div>
  );

return (
    <div className="veorders-dark-background">
      <div className="veorders-container">
        {loading ? (
          <div className="orders-loading">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="orders-empty">No orders found.</div>
        ) : (
          <>
            <h2>Vendor Orders</h2>
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Total (Rs.)</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) =>
                  order.products.map((p) => (
                    <tr key={order._id + p.productId}>
                      <td>{order.user}</td>
                      <td>{p.title}</td>
                      <td>{p.quantity}</td>
                      <td>{p.price * p.quantity}</td>
                      <td>{order.status}</td>
                      <td>
                        {order.status !== "Delivered" && (
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order._id, e.target.value)
                            }
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </>
        )}
        <ToastContainer />
      </div>
    </div>
  );
};

export default VeOrders;