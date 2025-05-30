// routes/password.route.js
import express from 'express';
import { handleForgotPassword } from '../controllers/password.controller.js';

const router = express.Router();

router.post('/', handleForgotPassword);


export default router;