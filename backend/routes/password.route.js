// routes/password.route.js
import express from 'express';
import { handleForgotPassword, handleResetPassword } from '../controllers/password.Controller.js';

const router = express.Router();

router.post('/forgot-password', handleForgotPassword);
router.post('/reset-password', handleResetPassword);

export default router;
