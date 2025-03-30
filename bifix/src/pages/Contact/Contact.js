import React, { useState } from "react";
import "./Contact.css";
import { FaLinkedin, FaGithub, FaFacebook } from "react-icons/fa";
import { Fade } from "react-awesome-reveal";
import { toast } from "react-toastify";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import "react-toastify/dist/ReactToastify.css";


const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!name || !email || !msg) {
        toast.error("Please provide all fields");
        return;
      }

      const res = await axios.post("http://localhost:8080/api/v1/bifix/sendEmail", {
        name,
        email,
        msg,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setName("");
        setEmail("");
        setMsg("");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />
        <div className="contact-box">
        <Fade duration={500}>
          <div className="contact-card">
                <h6 className="contact-heading">
                  Contact With 
                  <a href="https://www.linkedin.com/in/kavinda-dilshan-57a610241/" target="_blank" rel="noopener noreferrer">
                    <FaLinkedin className="icon linkedin" />
                  </a>
                  <a href="https://github.com/Kavinda2000" target="_blank" rel="noopener noreferrer">
                    <FaGithub className="icon github" />
                  </a>
                  <a href="https://www.facebook.com/kavinda.dilshan.3766/" target="_blank" rel="noopener noreferrer">
                    <FaFacebook className="icon facebook" />
                  </a>
                </h6>

                <div className="contact-divider">
                  <span className="line"></span>
                  <span className="or">OR</span>
                  <span className="line"></span>
                </div>

                <form className="contact-form" onSubmit={handleSubmit}>
                  <input className="contact-inp1"
                    type="text"
                    name="name"
                    placeholder="Enter Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <input className="contact-inp2"
                    type="email"
                    name="email"
                    placeholder="Enter Your Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <textarea className="contact-text"
                    name="msg"
                    placeholder="Write Your Message"
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    required
                  />
                  <button type="submit" className="submit-button">
                    SEND MESSAGE
                  </button>
                </form>
            </div>
      </Fade>
        </div>
    </>
  );
};

export default Contact;
