import React, { useEffect, useState } from 'react';
import './VenDashBoard.css';
import PartsForm from './components/partsform.js';
import { useLocation } from 'react-router-dom';
import VendorProductList from './components/Vendorproduct.js';
import UserProfileBar from '../components/UserProfileBar.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function VenDashBoard() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateFinished, setUpdateFinished] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const fetchUserData = async () => {
      let user = location.state?.user;
      if (!user) {
        user = JSON.parse(sessionStorage.getItem('userData'));
      }

      if (user?.email) {
        try {
          const res = await fetch(`http://localhost:5000/api/userDetails?email=${user.email}`);
          if (!res.ok) throw new Error('Failed to fetch user details');
          const data = await res.json();
          setUserData(data);
          sessionStorage.setItem('userData', JSON.stringify(data));
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        window.location.href = '/login';
      }
    };

    fetchUserData();
  }, [location.state]);

  if (!userData) {
    return <div>Loading user data...</div>;
  }

  const handleUpdateProfile = async (updatedData) => {
    setIsUpdating(true);
    setUpdateFinished(false);
    try {
      const res = await fetch(`http://localhost:5000/api/updateUser/${userData.email}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) throw new Error('Update failed');
      const result = await res.json();

      if (result.success) {
        setUserData(result.user);
        sessionStorage.setItem('userData', JSON.stringify(result.user));
        setUpdateFinished(true);
        toast.success('Profile updated successfully!');
      } else {
        toast.error('Update failed: ' + result.message);
      }
    } catch (err) {
      console.error(err);
      toast.error('Error updating profile');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="ven-dashboard-background">
      <ToastContainer />
      {isUpdating && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#fff',
            fontSize: '1.5rem',
            userSelect: 'none',
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
          updateFinished={updateFinished}
        />
      </div>

      <div className="ven-dashboard-container">
        <div className="your-products-card">
          <h2 className="your-products-title">Your Parts</h2>
          <div className="vencard-container">
            <div className="vencard" onClick={() => setIsFormOpen(true)}>
              <div className="plus-icon-container">
                <span className="plus-icon">+</span>
              </div>
              <h2 className="vencard-title">Publish a Product</h2>
            </div>
            <VendorProductList user={userData} />
          </div>
        </div>

        <div className="your-products-card">
          <h2 className="your-products-title">Your Services</h2>
          <div className="vencard-container">
            <div className="vencard">
              <div className="plus-icon-container">
                <span className="plus-icon">+</span>
              </div>
              <h2 className="vencard-title">Coming Soon</h2>
            </div>
          </div>
        </div>

        {isFormOpen && <PartsForm onClose={() => setIsFormOpen(false)} user={userData} />}
      </div>
    </div>
  );
}

export default VenDashBoard;
