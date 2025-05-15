import React from 'react'
import './ForgotPassword.css';
//import Navbar from '../../components/Navbar/Navbar';
import { Link } from 'react-router-dom';
import { Fade } from "react-awesome-reveal";

function ForgotPassword() {
  return (
    <>

          <div className="forgot-password-page">
          <Fade duration={500}>
            <div className="forgot-wrapper">
              <form>
                <h1 className='forgot-title'>Reset Password</h1>
    
                <div className="forgot-input">
                  <input type="email" placeholder="Email ID" required />
                  <i className="bx bxs-user"></i>
                </div>
    
                <button type="submit" className="forgot-btn">Submit</button>
    
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