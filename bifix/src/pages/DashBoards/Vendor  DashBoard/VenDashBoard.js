import React, { useEffect, useState } from 'react';
import './VenDashBoard.css';
import PartsForm from './components/partsform.js';
import { useNavigate } from 'react-router-dom';
import VendorProductList from './components/Vendorproduct.js';
import VendorTestList from './services/VendorTestList.js';
import TestForm from './services/TestForm.js';
import UserProfileBar from '../components/UserProfileBar.js';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

function VenDashBoard() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isTestFormOpen, setIsTestFormOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // ✅ Refresh triggers
  const [productRefresh, setProductRefresh] = useState(false);
  const [testRefresh, setTestRefresh] = useState(false);
  const [userRefresh, setUserRefresh] = useState(false);

  const navigate = useNavigate();

  // ✅ Fetch full vendor data
  useEffect(() => {
    const fetchUserData = async () => {
      const storedUserData = JSON.parse(sessionStorage.getItem('userData'));
      if (!storedUserData) return navigate('/login');

      try {
        const res = await axios.get(
          `http://localhost:5000/api/userDetails?email=${encodeURIComponent(storedUserData.email)}`
        );

        if (!res.data || res.data.role !== 'vendor') {
          toast.error('Unauthorized access');
          return navigate('/login');
        }

        setUserData(res.data);
        sessionStorage.setItem('userData', JSON.stringify(res.data));
      } catch (err) {
        console.error('Error fetching vendor data:', err);
        navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate, userRefresh]);

  if (!userData) return <p>Loading vendor data...</p>;

  // ✅ Update profile
  const handleUpdateProfile = async (updatedData) => {
    setIsUpdating(true);
    try {
      const res = await axios.put(
        `http://localhost:5000/api/updateUser/${encodeURIComponent(userData.email)}`,
        updatedData
      );

      if (res.data.success) {
        setUserData(res.data.user);
        sessionStorage.setItem('userData', JSON.stringify(res.data.user));
        toast.success('Profile updated successfully!');
        setUserRefresh(prev => !prev); // trigger refresh
      } else {
        toast.error('Update failed: ' + res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error('Error updating profile');
    } finally {
      setIsUpdating(false);
    }
  };

  // ✅ Trigger refresh after product/service added
  const handleProductAdded = () => setProductRefresh(prev => !prev);
  const handleTestAdded = () => setTestRefresh(prev => !prev);

  return (
    <div className="ven-dashboard-background">
      <video autoPlay loop muted>
        <source src="/121651-724710483_small.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {isUpdating && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#fff',
            fontSize: '1.5rem',
          }}
        >
          Updating...
        </div>
      )}

      <div className="vendashboard-header">
        <UserProfileBar
          userData={userData}
          onUpdateProfile={handleUpdateProfile}
          isUpdating={isUpdating}
        />
      </div>

      <div className="ven-dashboard-container">
        {/* PRODUCTS SECTION */}
        <div className="your-products-card">
          <h2 className="your-products-title">Your Products</h2>
          <div className="vencard-container">
            <div className="vencard" onClick={() => setIsFormOpen(true)}>
              <div className="plus-icon-container">
                <span className="plus-icon">+</span>
              </div>
              <h2 className="vencard-title">Publish a Product</h2>
            </div>
            <VendorProductList user={userData} refresh={productRefresh} onProductAdded={handleProductAdded} />
          </div>
        </div>

        {/* SERVICES / TESTS SECTION */}
        <div className="your-products-card">
          <h2 className="your-products-title">Your Services</h2>
          <div className="vencard-container">
            <div className="vencard" onClick={() => setIsTestFormOpen(true)}>
              <div className="plus-icon-container">
                <span className="plus-icon">+</span>
              </div>
              <h2 className="vencard-title">Publish a Service</h2>
            </div>
            <VendorTestList user={userData} refresh={testRefresh} />
          </div>
        </div>

        {isTestFormOpen && (
          <TestForm 
            onClose={() => setIsTestFormOpen(false)} 
            user={userData} 
            onTestAdded={handleTestAdded}
          />
        )}

        {/* CUSTOMER ORDERS SECTION */}
        <div className="your-products-card">
          <h2 className="your-products-title">Your Customers</h2>
          <div className="vencard-container">
            <div 
              className="vencard"
              onClick={() => navigate('/veorders')}
            >
              <div className="plus-icon-container" style={{ backgroundColor: '#28a745' }}>
                <span className="plus-icon">🛒</span>
              </div>
              <h2 className="vencard-title">View Orders</h2>
            </div>
          </div>
        </div>

        {/* PRODUCT FORM */}
        {isFormOpen && <PartsForm onClose={() => setIsFormOpen(false)} user={userData} onProductAdded={handleProductAdded} />}
      </div>
    </div>
  );
}

export default VenDashBoard;
