// controllers/verify.otp.js
import {otpStore} from './otp.store.js';


export const verifyOtp = (req, res) => {
  const { email, otp } = req.body;

  const storedOtp = otpStore[email];
  if (!storedOtp) {
    return res.status(400).json({ success: false, message: "OTP not found or expired" });
  }

  if (otp !== storedOtp) {
    return res.status(400).json({ success: false, message: "Invalid OTP" });
  }

  delete otpStore[email]; // Optional: remove after use

  return res.status(200).json({ success: true, message: "OTP verified successfully" });
};
