import express from 'express'
import dotenv from "dotenv"
<<<<<<< HEAD
import { connectDB } from './config/db.js'
=======
import {connectDB} from './config/db.js'
>>>>>>> f92b316531a7c0de4920f3e0a95d8d83825b1efc
import productRoutes from "./routes/product.route.js"
import emailRoutes from './routes/email.route.js'
import cors from 'cors'
import userRouter from './routes/user.route.js'
import userDetails from './routes/user.route.js'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
<<<<<<< HEAD
import userLoginRoutes from './routes/user.login.route.js'
=======
import  userLoginRoutes  from './routes/user.login.route.js'
>>>>>>> f92b316531a7c0de4920f3e0a95d8d83825b1efc
import vendorRoutes from './routes/vendor.route.js';
import repairScheduleRoutes from './routes/repairSchedule.route.js';
import otpRoutes from './routes/otp.route.js';
import checkoutRoutes from './routes/checkout.route.js';
import passwordRoutes from './routes/password.route.js';
<<<<<<< HEAD
import searchBarRoutes from './routes/search_bar.route.js'
import updateUser from './routes/user.route.js';
=======
import searchBarRoutes  from './routes/search_bar.route.js'
import  updateUser  from './routes/user.route.js';
>>>>>>> f92b316531a7c0de4920f3e0a95d8d83825b1efc
import bikeServiceRoutes from './routes/bikeService.route.js';

dotenv.config();



// Add this line to serve the uploads folder publicly







const PORT = process.env.PORT || 5000

// Before defining routes

const app = express();

// ✅ Increase limit to handle base64 image
app.use(express.json({ limit: '5mb' })); // or even '10mb' if needed
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use('/uploads', express.static('uploads'));

app.use(cors());
app.use(express.json());

<<<<<<< HEAD
app.use("/api/products", productRoutes)
app.use("/api/postEmails", emailRoutes)
app.use("/api/registerUser", userRouter)
app.use('/api/userDetails', userDetails);
app.use('/api/updateUser', updateUser);
app.use('/api/loginDetails', userLoginRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/repair-schedule", repairScheduleRoutes);
app.use("/api/otp", otpRoutes);
=======

app.use("/api/products",productRoutes)
app.use("/api/postEmails",emailRoutes)
app.use("/api/registerUser", userRouter)
app.use('/api/userDetails', userDetails);
app.use('/api/updateUser', updateUser);
app.use('/api/loginDetails', userLoginRoutes );
app.use("/api/vendors", vendorRoutes);
app.use("/api/repair-schedule", repairScheduleRoutes);
app.use("/api/otp",otpRoutes);
>>>>>>> f92b316531a7c0de4920f3e0a95d8d83825b1efc
app.use('/api/checkout', checkoutRoutes);
app.use('/api/checkout/success', userLoginRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/search', searchBarRoutes);
app.use('/api/bike-service', bikeServiceRoutes);



// Serve static files (React frontend)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


<<<<<<< HEAD
app.listen(5000, () => {
  connectDB();
  console.log('Server Started at http://localhost:' + PORT);
=======
app.listen(5000, ()=> {
  connectDB();
  console.log('Server Started at http://localhost:'+ PORT);
>>>>>>> f92b316531a7c0de4920f3e0a95d8d83825b1efc
})