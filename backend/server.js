import express from 'express'
import dotenv from "dotenv"
import {connectDB} from './config/db.js'
import productRoutes from "./routes/product.route.js"
import emailRoutes from './routes/email.route.js'
import cors from 'cors'
import userRouter from './routes/user.route.js'
import userDetails from './routes/user.route.js'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import  userLoginRoutes  from './routes/user.login.route.js'
import vendorRoutes from './routes/vendor.route.js';
import repairScheduleRoutes from './routes/repairSchedule.route.js';
import otpRoutes from './routes/otp.route.js';
import checkoutRoutes from './routes/checkout.route.js';
import passwordRoutes from './routes/password.route.js';
import searchBarRoutes  from './routes/search_bar.route.js'


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000

app.use(cors());
app.use(express.json());


app.use("/api/products",productRoutes)
app.use("/api/postEmails",emailRoutes)
app.use("/api/registerUser", userRouter)
app.use('/api/userDetails', userDetails);
app.use('/api/loginDetails', userLoginRoutes );
app.use("/api/vendors", vendorRoutes);
app.use("/api/repair-schedule", repairScheduleRoutes);
app.use("/api/otp",otpRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/checkout/success', userLoginRoutes);
app.use('/api/password/forgot-password', passwordRoutes);
app.use('/api/search', searchBarRoutes);
app.use('/uploads', express.static('uploads'));



// Serve static files (React frontend)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


app.listen(5000, ()=> {
  connectDB();
  console.log('Server Started at http://localhost:'+ PORT);
})



