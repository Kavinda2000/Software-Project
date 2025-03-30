import React from 'react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";
import "./Navbar.css"; // Import the CSS file
import logo from "./Logo.png";

function Navbar() {
  const [nav, setNav] = useState(false);

  const changeBackground = () => {
    if (window.scrollY >= 50) {
      setNav(true);
    } else {
      setNav(false);
    }
  };

  // Use effect to add the scroll event listener only once when the component is mounted
  useEffect(() => {
    window.addEventListener("scroll", changeBackground);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", changeBackground);
    };
  }, []);

  return (
    <div className={`navbar ${nav ? "navbar-scrolled" : ""}`}>
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="Logo"/>
        </Link>
      </div>
      <ul className="nav-links">
        <li></li>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/parts">Parts</Link></li>
        <li><Link to="/services">Services</Link></li>
        <li><Link to="/contact">Contact Us</Link></li>
        <li><Link to="/login">Log In</Link></li>
      </ul>
    </div>
  );
}

export default Navbar;
