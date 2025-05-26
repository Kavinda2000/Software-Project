// routes/password.route.js
import express from 'express';
import { handleForgotPassword } from '../controllers/password.Controller.js';

const router = express.Router();

router.post('/forgot-password', handleForgotPassword);


export default router;
