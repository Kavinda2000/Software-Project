import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';
import logo from './Logo.png';

function Navbar() {
  const [nav, setNav] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);
  const exitTimeoutRef = useRef(null);
  const location = useLocation();

  // Check login state whenever location changes (on route change)
  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    setIsLoggedIn(!!token);
    setUser(userData);
  }, [location]);

  // Handle navbar scroll effect
  const changeBackground = () => {
    setNav(window.scrollY >= 50);
  };

  useEffect(() => {
    window.addEventListener('scroll', changeBackground);
    return () => window.removeEventListener('scroll', changeBackground);
  }, []);

  // Handle logout functionality
  const handleLogout = () => {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userData');
    setIsLoggedIn(false);
    setIsDropdownVisible(false); // Ensure the dropdown is closed after logout
    navigate('/login');
  };
  // Only toggle the dropdown on user interaction
  const toggleDropdown = () => {
    setIsDropdownVisible((prevState) => !prevState);
    clearTimeout(timeoutRef.current);
    clearTimeout(exitTimeoutRef.current);
  };

  // Handle mouse events for dropdown hover behavior
  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    clearTimeout(exitTimeoutRef.current);
  };

  const handleMouseLeave = () => {
    exitTimeoutRef.current = setTimeout(() => {
      setIsDropdownVisible(false);
    }, 2000);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownVisible(false);
        clearTimeout(timeoutRef.current);
        clearTimeout(exitTimeoutRef.current);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`navbar ${nav ? 'navbar-scrolled' : ''}`}>
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="Logo" />
        </Link>
      </div>
      <ul className="nav-links">
        <li ><Link to="/">Home</Link></li>
        <li ><Link to="/parts">Parts</Link></li>
        <li ><Link to="/services">Services</Link></li>
        <li ><Link to="/contact">Contact Us</Link></li>
        {!isLoggedIn && <li ><Link to="/login">Log In</Link></li>}

        {isLoggedIn && user && (
          <li className="user-dropdown" ref={dropdownRef}>
            <div className="user-profile" onClick={toggleDropdown}>
              <img 
                src="https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg?semt=ais_hybrid&w=740" 
                alt="User Avatar"
                className="avatar" 
              />
            </div>
            {isDropdownVisible && (
                <ul 
                className="dropdown-menu" 
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                >
                  <li className='dropdown-elements'>
                    <Link 
                      to={`/${user.role}-dashboard`} 
                      onClick={() => setIsDropdownVisible(false)}
                    >Profile</Link>
                  </li>
                  <li className='dropdown-elements'>
                  <Link 
                    to="/profile" 
                    onClick={() => setIsDropdownVisible(false)}
                  >Settings</Link>
                  </li>
                  <li 
                    onClick={handleLogout} 
                    className='dropdown-elements'
                  >Log Out
                  </li>
               </ul>
              )}
          </li>
        )}
        
      </ul>
    </div>
  );
}

export default Navbar;
