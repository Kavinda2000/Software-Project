import express from "express";
import { sendOtp } from "../controllers/SendOtp.controller.js";
import { verifyOtp } from "../controllers/VerifyOtp.controller.js";
const router = express.Router();

router.post("/send", sendOtp);
router.post('/verify', verifyOtp);   // /api/otp/verify

export default router;