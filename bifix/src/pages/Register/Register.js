import React, { useState } from "react";
import "./Register.css";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify'; // Import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles
import { useNavigate } from 'react-router-dom'; // Import useNavigate


function Register() {
  const [role, setRole] = useState();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();
  const [password, setPassword] = useState();
  const [gender, setGender] = useState();
  const [address, setAddress] = useState();



  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if all fields are filled
    if (!role || !name || !email || !phone || !password || (role === "customer" && !gender) || (role === "vendor" && !address)) {
      toast.error("Please fill all fields!"); // Show error toast
      return;
    }

    axios.post('http://localhost:5000/api/registerUser', { role, name, email, phone, password, gender, address })
      .then(result => {
        console.log(result);
        toast.success("Account created successfully!"); // Show success toast

        setTimeout(() => {
        // Navigate to the appropriate page based on the role
          navigate('/Login');
          }, 2000);

      })
      .catch(err => {
        console.log(err);
        toast.error("Something went wrong. Please try again."); // Show error toast
      });
  };

  return (
    <div className="register-page">
      <ToastContainer /> {/* Toast container for displaying notifications */}
      <div className="register-container">
        <h2>Registration</h2>
        <form onSubmit={handleSubmit}>

          <div className="dropdown-selector">
            <label htmlFor="role-select">You Are A:</label>
            <select id="role-select" value={role} onChange={(e) => setRole(e.target.value)} required>
              <option value="">Choose your Role</option>
              <option value="customer">Customer</option>
              <option value="vendor">Vendor</option>
            </select>
          </div>

          <div className={`register-form-container ${role ? "expand" : ""}`}>
            {role === "customer" && (
              <div className="register-form">
                <div className="form-row">
                  <div className="form-column">
                    <label htmlFor="customer-name">Name</label>
                    <input
                      type="name"
                      id="customer-name"
                      placeholder="Enter your name"
                      onChange={(e) => setName(e.target.value)} required />
                  </div>
                  <div className="form-column">
                    <label htmlFor="customer-email">Email</label>
                    <input
                      type="email"
                      id="customer-email"
                      placeholder="Enter your email"
                      onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-column">
                    <label htmlFor="phone-number">Phone Number</label>
                    <input type="tel" id="phone-number" placeholder="Enter phone number" onChange={(e) => setPhone(e.target.value)} required />
                  </div>
                  <div className="form-column">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-column">
                    <label>Gender</label>
                    <div className="gender-options">
                      <div className="option">
                        <input type="radio" id="male" name="gender" value="male" onChange={(e) => setGender(e.target.value)} required />
                        <label htmlFor="male">Male</label>
                      </div>
                      <div className="option">
                        <input type="radio" id="female" name="gender" value="female" onChange={(e) => setGender(e.target.value)} required />
                        <label htmlFor="female">Female</label>
                      </div>
                    </div>
                  </div>
                </div>
                <button type="submit">Register as Customer</button>
              </div>
            )}

            {role === "vendor" && (
              <div className="register-form">

                <div className="form-row">
                  <div className="form-column">
                    <label htmlFor="vendor-name">Business Name</label>
                    <input type="text" id="vendor-name" placeholder="Enter your business name" onChange={(e) => setName(e.target.value)} required />
                  </div>
                  <div className="form-column">
                    <label htmlFor="vendor-email">Business Email</label>
                    <input type="email" id="vendor-email" placeholder="Enter your business email" onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-column">
                    <label htmlFor="vendor-phone">Telephone Number</label>
                    <input type="tel" id="vendor-phone" placeholder="Enter your phone number" onChange={(e) => setPhone(e.target.value)} required />
                  </div>
                  <div className="form-column">
                    <label htmlFor="vendor-password">Password</label>
                    <input type="password" id="vendor-password" onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-column">
                    <label htmlFor="address">Address</label>
                    <input type="text" id="address" placeholder="Enter your address" onChange={(e) => setAddress(e.target.value)} required />
                  </div>
                </div>
                <button type="submit">Register as Vendor</button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;