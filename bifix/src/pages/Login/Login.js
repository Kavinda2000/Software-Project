import React, { useState, useEffect } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { Fade } from "react-awesome-reveal";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  // Autofill from localStorage on component mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    const rememberedPassword = localStorage.getItem('rememberedPassword');
    const rememberMeStatus = localStorage.getItem('rememberMe') === 'true';

    if (rememberMeStatus && rememberedEmail && rememberedPassword) {
      setEmail(rememberedEmail);
      setPassword(rememberedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/loginDetails', { email, password });

      if (response.data.success) {
        // Save credentials if Remember Me is checked
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
          localStorage.setItem('rememberedPassword', password);
          localStorage.setItem('rememberMe', 'true');
        } else {
          localStorage.removeItem('rememberedEmail');
          localStorage.removeItem('rememberedPassword');
          localStorage.removeItem('rememberMe');
        }

        // Save auth data in sessionStorage
        sessionStorage.setItem('authToken', response.data.token);
        sessionStorage.setItem('userData', JSON.stringify(response.data.user));

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
      <ToastContainer autoClose={3000} />
      <div className="login-page">
        <video className="background-video" autoPlay loop muted playsInline>
          <source src="/log.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <Fade duration={500}>
          <div className="login-wrapper">
            <form onSubmit={handleLogin}>
              <h1>Login</h1>

              <div className="input-box">
                <input
                  type="email"
                  name="email" // ✅ important for browser autofill
                  autoComplete="email" // ✅ standard keyword for autofill
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <i className="bx bxs-user"></i>
              </div>

              <div className="input-box password-box">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password" // ✅ helps with autofill of password
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className="password-toggle-icon"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: 'pointer' }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
                <i className="bx bx-lock"></i>
              </div>

              <div className="remember-forgot">
                <label>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  /> Remember me
                </label>
                <Link to="/forgot-password">Forgot password?</Link>
              </div>

              <button type="submit" className="btn">Login</button>

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
