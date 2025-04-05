import React from 'react'
import './ForgotPassword.css';
import Navbar from '../../components/Navbar/Navbar';
import { Link } from 'react-router-dom';
import { Fade } from "react-awesome-reveal";

function ForgotPassword() {
  return (
    <>
          <Navbar />
          <div className="forgot-password-page">
          <Fade duration={500}>
            <div className="forgot-wrapper">
              <form>
                <h1>Reset Password</h1>
    
                <div className="input-box">
                  <input type="email" placeholder="Email ID" required />
                  <i className="bx bxs-user"></i>
                </div>
    
                <button type="submit" className="btn">Submit</button>
    
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