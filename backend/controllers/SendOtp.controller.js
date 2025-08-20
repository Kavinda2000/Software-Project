import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
import { otpStore } from './otp.store.js';


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Helper to generate a 6-digit OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // Validation
    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Please provide an email address",
      });
    }

    //Generate OTP and store it with the email
    const otp = generateOtp();
    otpStore[email] = otp;

    //Send the OTP via email
    await transporter.sendMail({
      to: email,
      from: process.env.EMAIL_USER,
      subject: "Your Bifix OTP Code",
      html: `
        <h4>Your OTP Code</h4>
        <p style="font-size:1.5rem;letter-spacing:0.3em;"><b>${otp}</b></p>
        <p>This code will expire in 5 minutes.</p>
      `,
    });

    //Return success
    return res.status(200).send({
      success: true,
      message: "OTP sent successfully",
      otp,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Send OTP API Error",
      error,
    });
  }
};
