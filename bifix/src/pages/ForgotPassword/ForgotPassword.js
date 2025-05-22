import React, { useState } from 'react';
import './ForgotPassword.css';
import { Link } from 'react-router-dom';
import { Fade } from "react-awesome-reveal";


//import Navbar from '../../components/Navbar/Navbar';


function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/password/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || "Something went wrong. Please try again.");
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage("Something went wrong. Please try again.");
      console.error(err);
    }
  };

  return (
    <>

          <div className="forgot-password-page">
          <Fade duration={500}>
            <div className="forgot-wrapper">
              <form onSubmit={handleSubmit}>
                <h1 className='forgot-title'>Reset Password</h1>
    
                <div className="forgot-input">
                  <input
                    type="email"
                    placeholder="Email ID"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                  <i className="bx bxs-user"></i>
                </div>
    
                <button type="submit" className="forgot-btn">Submit</button>
                {message && <div className="forgot-message">{message}</div>}
    
                <div className="back-login">
                  <p>
                    <Link to="/login">Back to Login</Link>
                  </p>
                </div>
              </form>
            </div>
          </Fade>
          </div>
        </>
      );
    }
    

export default ForgotPassword;