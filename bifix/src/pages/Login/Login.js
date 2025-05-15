import React, { useState } from 'react'; // Add useState
import './Login.css';
import { Link, useNavigate } from 'react-router-dom'; // Add useNavigate
import { Fade } from "react-awesome-reveal";
import axios from 'axios'; // Import axios for API calls
import { toast, ToastContainer } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

function Login({setUser}) {
  const [email, setEmail] = useState(''); // State for username
  const [password, setPassword] = useState(''); // State for password
  const navigate = useNavigate(); // For navigation

  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/loginDetails', { email, password });
  
      if (response.data.success) {
        // Store the JWT token and user data
        sessionStorage.setItem('authToken', response.data.token);
        sessionStorage.setItem('userData', JSON.stringify(response.data.user));
  
        // Redirect to the appropriate dashboard
        if (response.data.user.role === 'customer') {
          navigate('/customer-dashboard');
        } else if (response.data.user.role === 'vendor') {
          navigate('/vendor-dashboard');
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <>
      <ToastContainer autoClose={3000}/> {/* Toast container for notifications */}
      <div className="login-page">
        <Fade duration={500}>
          <div className="login-wrapper">
            <form onSubmit={handleLogin}> {/* Attach handleLogin */}
              <h1>Login</h1>

              <div className="input-box">
                <input
                  type="text"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} // Bind to state
                  required
                />
                <i className="bx bxs-user"></i>
              </div>

              <div className="input-box">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} // Bind to state
                  required
                />
                <i className="bx bx-lock"></i>
              </div>

              <div className="remember-forgot">
                <label>
                  <input type="checkbox" /> Remember me
                </label>
                <Link to="/forgot-password">Forgot password?</Link>
              </div>

              <button type="submit" className="btn">Login</button> {/* Submit button */}

              <div className="register-link">
                <p>
                  Don't have an account? <Link to="/register">Register</Link>
                </p>
              </div>
            </form>
          </div>
        </Fade>
      </div>
    </>
  );
}

export default Login;

