import express from "express";
import { sendOrderEmail } from "../controllers/orderEmailController.js";

const router = express.Router();

// POST /api/orderEmails
router.post("/", sendOrderEmail);

export default router;
