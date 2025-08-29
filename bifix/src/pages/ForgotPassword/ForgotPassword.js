import React, { useState } from 'react';
import './ForgotPassword.css';
import { Link } from 'react-router-dom';
import { Fade } from "react-awesome-reveal";
import { toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function ForgotPassword() {
  const [email, setEmail] = useState('');

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
        toast.error(data.message || "Something went wrong. Please try again.", { position: 'top-right', autoClose: 3000 });
      } else {
        toast.success(data.message, { position: 'top-right', autoClose: 3000 });
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.", { position: 'top-right', autoClose: 3000 });
      console.error(err);
    }
  };

  return (
    <>
      <div className="forgot-password-page">
        <Fade duration={500}>
          <div className="forgot-wrapper">
            <form onSubmit={handleSubmit}>
              <h1 className='forgot-title' style={{ marginBottom: '32px' }}>Reset Password</h1>
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