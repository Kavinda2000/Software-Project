// components/VendorTestList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Settings, Trash2, Clock } from "lucide-react";
import './VendorTestList.css';
import UpdateServiceForm from './update services/UpdateServiceForm';
import Modal from 'react-modal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SERVER_URL = 'http://localhost:5000/api/';
Modal.setAppElement('#root');

const VendorTestList = ({ user, refresh }) => {
  const [tests, setTests] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [deleteServiceId, setDeleteServiceId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  // ✅ Handle delete service like VendorProductList
  const handleDelete = async (id) => {
    if (!id) return;
    setProcessing(true);
    try {
      await axios.delete(`${SERVER_URL}tests/${id}`);
      setTests(prev => prev.filter(t => t._id !== id));
      toast.success("Test deleted successfully!");
    } catch (err) {
      console.error("Error deleting test:", err);
      toast.error("Failed to delete test.");
    } finally {
      setProcessing(false);
      setIsDeleteModalOpen(false);
      setDeleteServiceId(null);
    }
  };

  // ✅ Handle update service
  const handleUpdate = async (updatedService) => {
    setProcessing(true);
    try {
      await axios.put(`${SERVER_URL}tests/${updatedService._id}`, updatedService);
      setTests(prev => prev.map(t => t._id === updatedService._id ? updatedService : t));
      toast.success("Test updated successfully!");
    } catch (err) {
      console.error("Error updating test:", err);
      toast.error("Failed to update test.");
    } finally {
      setProcessing(false);
      setEditingService(null);
    }
  };

  // Fetch vendor tests
  useEffect(() => {
    const fetchVendorTests = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}tests`);
        const allTests = res.data.data;
        const userTests = allTests.filter(t => t.owner === user.email || t.owner === user.name);
        setTests(userTests);
      } catch (err) {
        console.error("Error fetching vendor tests:", err);
      }
    };
    if (user) fetchVendorTests();
  }, [user, refresh]);

  return (
    <div className="vendor-test-list">
      <ToastContainer position="bottom-right" autoClose={3000} />
      {processing && (
        <div className="vendor-test-processing-overlay">
          <div className="vendor-test-spinner"></div>
          <p>Processing...</p>
        </div>
      )}

      {editingService && (
        <UpdateServiceForm
          service={editingService}
          onClose={() => setEditingService(null)}
          onUpdated={handleUpdate}
        />
      )}

      {/* Delete confirmation modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={() => setIsDeleteModalOpen(false)}
        contentLabel="Confirm Delete"
        className="vendor-test-delete-modal"
        overlayClassName="vendor-test-delete-overlay"
        shouldCloseOnOverlayClick={false}
      >
        <h3>Are you sure?</h3>
        <p>Do you really want to delete this test? This action cannot be undone.</p>
        <div className="vendor-test-delete-buttons">
          <button className="vendor-test-cancel-btn" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
          <button className="vendor-test-confirm-btn" onClick={() => handleDelete(deleteServiceId)}>Delete</button>
        </div>
      </Modal>

      {tests.length === 0 ? (
        <p>No Tests published yet.</p>
      ) : (
        tests.map(service => (
          <div key={service._id} className="vendor-test-card">
            <h3>{service.name}</h3>
            <p><strong>Type:</strong> {service.testType}</p>
            <p><strong>Address:</strong> {service.address}</p>
            {service.price && <p><strong>Price:</strong> {service.price}</p>}

            {/* Time slots */}
            {service.timeSlots && service.timeSlots.length > 0 && (
              <div className="vendor-test-time-slots">
                <p className="vendor-test-slot-label"><Clock size={14} /> <strong>Time Slots:</strong></p>
                <ul>
                  {service.timeSlots.map((slot, i) => (
                    <li key={i} className="vendor-test-slot">
                      {new Date(slot.date).toLocaleDateString()} — {slot.slot} {slot.booked ? "(Booked)" : ""}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="vendor-test-actions">
              <button className="vendor-test-update-btn" onClick={() => setEditingService(service)}>
                <Settings size={18} />
              </button>
              <button 
                className="vendor-test-delete-btn"
                onClick={() => {
                  setDeleteServiceId(service._id);
                  setIsDeleteModalOpen(true);
                }}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default VendorTestList;
