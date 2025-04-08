import React, { useState } from "react";
import axios from "axios";
import "./Register.css";

function Register() {
  const [activeForm, setActiveForm] = useState("customer");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  const handleTabClick = (type) => {
    setActiveForm(type);
    setFormData({ ...formData, role: type });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/api/v1/users/register", formData);
      if (res.data.success) {
        alert(res.data.message);
        setFormData({ name: "", email: "", password: "", role: "customer" });
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Registration failed. Please try again.");
    }
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

        <form className="register-form" onSubmit={handleSubmit}>
          <h2>{activeForm === "customer" ? "Customer Registration" : "Vendor Registration"}</h2>
          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
