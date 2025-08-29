import React, { useEffect, useState } from 'react';
import './CusDashBoard.css';
import { Fade } from "react-awesome-reveal";
import { useLocation, useNavigate } from 'react-router-dom';
import UserProfileBar from '../components/UserProfileBar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

function CustomerDashBoard() {
  const [userData, setUserData] = useState(null); 
  const location = useLocation();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      let user = location.state?.user;

      if (!user) {
        const storedUserData = JSON.parse(sessionStorage.getItem('userData'));
        user = storedUserData;
      }

      if (user) {
        setUserData(user); 
      } else {
        navigate('/login'); 
      }
    };

    fetchUserData();
  }, [location.state, navigate]);

  const handleUpdateProfile = async (updatedData) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`http://localhost:5000/api/updateUser/${userData.email}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      const result = await res.json();

      if (result.success) {
        setUserData(result.user);
        sessionStorage.setItem('userData', JSON.stringify(result.user));
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

  if (!userData) return <p>Loading...</p>;

  return (
    <>
      <ToastContainer autoClose={3000} />
      <div className="cusdashboard-page">
        <Fade duration={500}>
          <div className="cusdashboard-header">
            <UserProfileBar 
              userData={userData} 
              onUpdateProfile={handleUpdateProfile} 
              isUpdating={isUpdating} 
            />
          </div>

          <div className="cusdashboard-wrapper">
            <div className="cusdashboard-sections">

              <div className="cusdashboard-section">
                <Link to="/customer-scheduling">
                  <h2>Your Appointments</h2>
                  <p>View and manage your service appointments</p>
                </Link>
              </div>

              <div className="cusdashboard-section">
                <Link to="/cusorders">
                  <h2>Your Orders</h2>
                  <p>You have no orders yet. Start shopping now!</p>
                </Link>
              </div>

              <div className="cusdashboard-section">
                <Link to="/customer-support">
                  <h2>Support</h2>
                  <p>Need help? Contact our support team for assistance.</p>
                </Link>
              </div>

            </div>
          </div>
        </Fade>
      </div>
    </>
  );
}

export default CustomerDashBoard;