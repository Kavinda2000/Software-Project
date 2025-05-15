import React, { useEffect, useState } from 'react';
import './VenDashBoard.css';
import PartsForm from './components/partsform.js';
import { useLocation } from 'react-router-dom'; // Import useLocation to retrieve passed state
import VendorProductList from './components/Vendorproduct.js'; // Import the VendorProductList component


function VenDashBoard() {
  const [isFormOpen, setIsFormOpen] = useState(false);
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
    <div className="ven-dashboard-background">
      <div className="ven-dashboard-container">


      {/* Parts Form Modal */}
      {isFormOpen && <PartsForm onClose={() => setIsFormOpen(false)} 
        user={location.state?.user || JSON.parse(sessionStorage.getItem('userData'))}/>}

        <div className="title-container">
          <h1 className="dashboard-title">Hello, {userName || 'User'}!</h1> {/* Personalized greeting */}
          <hr className="title-underline" />
        </div>

        {/* Parts Section */}
        <div className="your-products-card">
          <h2 className="your-products-title">Your Parts</h2>
          <div className="vencard-container">
            <div className="vencard">
              <div
                className="plus-icon-container"
                onClick={() => setIsFormOpen(true)}
              >
                <span className="plus-icon">+</span>
              </div>
              <h2 className="vencard-title">Publish a Product</h2>
            </div>
            {/* Display Vendor Products */}
            <VendorProductList user={location.state?.user || JSON.parse(sessionStorage.getItem('userData'))} />
          </div>
        </div>

        {/* Services Section */}
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
      </div>

    </div>
  );
}

export default VenDashBoard;
