import React, { useEffect, useState } from 'react';
import './CusDashBoard.css';
//import Navbar from '../../../components/Navbar/Navbar';
import { Fade } from "react-awesome-reveal";
import { useLocation } from 'react-router-dom'; // Import useLocation to retrieve passed state

function CustomerDashBoard() {
  const [userName, setUserName] = useState('');
  const location = useLocation(); // Hook to access the passed state (from navigate)

  useEffect(() => {
    const fetchUserData = async () => {
      let user = location.state?.user; // Try to get user from navigate state

      if (!user) {
        // If user data is not passed via navigate, fallback to sessionStorage
        const storedUserData = JSON.parse(sessionStorage.getItem('userData'));
        user = storedUserData;
      }

      if (user) {
        setUserName(user.name); // Set the user's name
      } else {
        // If no user data available, redirect to login
        window.location.href = '/login';
      }
    };

    fetchUserData();
  }, [location.state]);

  return (
    <>

      <div className="cusdashboard-page">
        <Fade duration={500}>
          <div className="cusdashboard-wrapper">
            <h1>Hello, {userName || 'User'}!</h1> {/* Personalized greeting */}
            <div className="cusdashboard-sections">
              <div className="cusdashboard-section">
                <h2>Your Orders</h2>
                <p>You have no orders yet. Start shopping now!</p>
              </div>
              <div className="cusdashboard-section">
                <h2>Account Settings</h2>
                <p>Manage your account details and preferences here.</p>
              </div>
              <div className="cusdashboard-section">
                <h2>Support</h2>
                <p>Need help? Contact our support team for assistance.</p>
              </div>
            </div>
          </div>
        </Fade>
      </div>
    </>
  );
}

export default CustomerDashBoard;
