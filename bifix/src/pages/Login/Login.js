import React from 'react';
import './Login.css';
import Navbar from '../../components/Navbar/Navbar';
import { Link } from 'react-router-dom';
import { Fade } from "react-awesome-reveal";

function Login() {
  return (
    <>
      <Navbar />
      <div className="login-page">
      <Fade duration={500}>
        <div className="login-wrapper">
          <form>
            <h1>Login</h1>

            <div className="input-box">
              <input type="text" placeholder="Username" required />
              <i className="bx bxs-user"></i>
            </div>

            <div className="input-box">
              <input type="password" placeholder="Password" required />
              <i className="bx bx-lock"></i>
            </div>

            <div className="remember-forgot">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <a href="s">Forgot password?</a>
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
