import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "./VeAppointment.css";

const VeAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const vendorEmail = JSON.parse(sessionStorage.getItem("userData"))?.email; // vendor's email

  // Fetch appointments from backend
  useEffect(() => {
    if (!vendorEmail) {
      toast.error("Vendor not logged in!");
      setLoading(false);
      return;
    }

    const fetchAppointments = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/repair-schedule/vendor/${vendorEmail}`
        );
        setAppointments(res.data.bookings || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [vendorEmail]);

  // Update status or paymentStatus in backend
  const handleUpdate = async (id, field, value) => {
    try {
      await axios.put(`http://localhost:5000/api/repair-schedule/${id}`, {
        [field]: value,
      });

      setAppointments((prev) =>
        prev.map((app) => (app._id === id ? { ...app, [field]: value } : app))
      );

      toast.success(`${field} updated successfully`);
    } catch (err) {
      console.error(err);
      toast.error(`Failed to update ${field}`);
    }
  };

  if (loading) return <div className="appointments-loading">Loading appointments...</div>;

  if (!appointments.length)
    return (
      <div className="appointments-dark-background">
        <div className="appointments-container">
          <div className="appointments-empty">No appointments found.</div>
        </div>
      </div>
    );

  return (
    <div className="appointments-dark-background">
      <div className="appointments-container">
        <h2>All Appointments</h2>
        <table className="appointments-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Bike Model</th>
              <th>Service Name</th> {/* <-- New column */}
              <th>Date</th>
              <th>Time</th>
              <th>Issue</th>
              <th>Status</th>
              <th>Payment</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((app) => (
              <tr key={app._id}>
                <td>{app.customerName}</td>
                <td>{app.bikeModel}</td>
                <td>{app.serviceId?.name || "Unknown Service"}</td> {/* <-- service name */}
                <td>{new Date(app.repairDate).toLocaleDateString()}</td>
                <td>{app.timeSlot}</td>
                <td>{app.issueDescription}</td>
                <td>
                  <select
                    value={app.status}
                    onChange={(e) => handleUpdate(app._id, "status", e.target.value)}
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td>
                  <select
                    value={app.paymentStatus}
                    onChange={(e) =>
                      handleUpdate(app._id, "paymentStatus", e.target.value)
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VeAppointment;
