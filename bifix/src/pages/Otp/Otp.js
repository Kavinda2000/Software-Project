// Otp.js
import { useState, useRef, useEffect} from "react";
import axios from "axios";
import { toast} from "react-toastify";
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import './Otp.css'; // Add custom styling here

function Otp() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const [timer, setTimer] = useState(180); // 3 minutes
  const [resendEnabled, setResendEnabled] = useState(false);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else {
      setResendEnabled(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = () => {
  const minutes = String(Math.floor(timer / 60)).padStart(2, "0");
  const seconds = String(timer % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
  };

  const handleResendOtp = async () => {
    const storedUser = localStorage.getItem("pendingUser");
    if (!storedUser) {
      toast.error("No user data found!");
      return;
    }

  const userData = JSON.parse(storedUser);
  try {
    await axios.post("http://localhost:5000/api/otp/send", {
      email: userData.email,
    });

    toast.info("A new OTP has been sent to your email.");
    setOtp(["", "", "", "", "", ""]);
    setTimer(180);
    setResendEnabled(false);
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to resend OTP");
  }
};




  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return; // allow only digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus(); // move to next
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus(); // go back
    }
  };

const handleOtpVerify = async (e) => {
  e.preventDefault();

  const storedUser = localStorage.getItem("pendingUser");
  if (!storedUser) {
    toast.error("No user data found!");
    return;
  }

  const userData = JSON.parse(storedUser);

  try {
    // Step 1: Verify OTP
    await axios.post("http://localhost:5000/api/otp/verify", {
      email: userData.email,
      otp: otp.join(""),
    });

    // Step 2: Register the user
    await axios.post("http://localhost:5000/api/users/registerUser", userData);

    // Step 3: Login
    const loginResponse = await axios.post("http://localhost:5000/api/loginDetails", {
      email: userData.email,
      password: userData.password,
    });

    // Step 4: Store token and user data
    sessionStorage.setItem("authToken", loginResponse.data.token);
    sessionStorage.setItem("userData", JSON.stringify(loginResponse.data.user));

    // ✅ Show success toast first
    toast.success("OTP verified! Account created.");

    // Step 5: Delay and redirect
    const role = loginResponse.data.user.role;
    setTimeout(() => {
      if (role === "customer") {
        navigate("/customer-dashboard");
      } else if (role === "vendor") {
        navigate("/vendor-dashboard");
      } else {
        navigate("/");
      }

      localStorage.removeItem("pendingUser"); // clear after redirect
    }, 1200); // 1.2 seconds delay so toast is visible

  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || "Verification or login failed");
  }
};




 return (
    <div className="otp-container">
   
      <form onSubmit={handleOtpVerify} className="otp-form">
        <h2>Enter OTP</h2>
        <div className="otp-inputs">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              ref={(el) => (inputsRef.current[index] = el)}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleBackspace(e, index)}
              className="otp-box"
            />
          ))}
        </div>
        <div className="timer-resend">
          <span className="timer-text">
            {resendEnabled
              ? "Didn't receive the code?"
              : `Resend available in ${formatTime()}`}
          </span>
          {resendEnabled && (
            <button type="button" className="resend-button" onClick={handleResendOtp}>
              Resend OTP
            </button>
          )}
        </div>
        <button className="otp_button" type="submit">Verify & Register</button>
      </form>
    </div>
  );
}

export default Otp;