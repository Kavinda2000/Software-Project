import React, { useState } from "react";
import "./Register.css";

function Register() {
  const [activeForm, setActiveForm] = useState("customer");

  const handleTabClick = (type) => {
    setActiveForm(type);
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-slider">
          <div
            className={`tab ${activeForm === "customer" ? "active-tab" : ""}`}
            onClick={() => handleTabClick("customer")}
          >
            Customer
          </div>
          <div
            className={`tab ${activeForm === "vendor" ? "active-tab" : ""}`}
            onClick={() => handleTabClick("vendor")}
          >
            Vendor
          </div>
          <div
            className="slider-indicator"
            style={{ transform: activeForm === "customer" ? "translateX(0)" : "translateX(100%)" }}
          />
        </div>

        <div className="register-form-container">
          {activeForm === "customer" && (
            <form className="register-form">
              <h2>Customer Registration</h2>
              <div className="form-row">
                <div className="form-column">
                  <label htmlFor="customer-name">Name</label>
                  <input type="text" id="customer-name" placeholder="Enter your name" required />
                </div>
                <div className="form-column">
                  <label htmlFor="customer-email">Email</label>
                  <input type="email" id="customer-email" placeholder="Enter your email" required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-column">
                  <label htmlFor="phone-number">Phone Number</label>
                  <input type="tel" id="phone-number" placeholder="Enter phone number" required />
                </div>
                <div className="form-column">
                  <label htmlFor="password">Password</label>
                  <input type="password" id="password" required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-column">
                  <label>Gender</label>
                  <div className="gender-options">
                    <div className="option">
                      <input type="radio" id="male" name="gender" value="male" required />
                      <label htmlFor="male">Male</label>
                    </div>
                    <div className="option">
                      <input type="radio" id="female" name="gender" value="female" required />
                      <label htmlFor="female">Female</label>
                    </div>
                  </div>
                </div>
              </div>
              <button type="submit">Register as Customer</button>
            </form>
          )}

          {activeForm === "vendor" && (
            <form className="register-form">
              <h2>Vendor Registration</h2>
              <div className="form-row">
                <div className="form-column">
                  <label htmlFor="vendor-name">Business Name</label>
                  <input type="text" id="vendor-name" placeholder="Enter your business name" required />
                </div>
                <div className="form-column">
                  <label htmlFor="vendor-email">Business Email</label>
                  <input type="email" id="vendor-email" placeholder="Enter your business email" required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-column">
                  <label htmlFor="vendor-phone">Telephone Number</label>
                  <input type="tel" id="vendor-phone" placeholder="Enter your phone number" required />
                </div>
                <div className="form-column">
                  <label htmlFor="vendor-password">Password</label>
                  <input type="password" id="vendor-password" required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-column">
                  <label htmlFor="address">Address</label>
                  <input type="text" id="address" placeholder="Enter your address" required />
                </div>
              </div>
              <button type="submit">Register as Vendor</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Register;
