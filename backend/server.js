import express from 'express'
import dotenv from "dotenv"
import { connectDB } from './config/db.js'
import productRoutes from "./routes/product.route.js"
import emailRoutes from './routes/email.route.js'
import cors from 'cors'
import userRouter from './routes/user.route.js'
import userDetails from './routes/user.route.js'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import userLoginRoutes from './routes/user.login.route.js'
import vendorRoutes from './routes/vendor.route.js';
import repairScheduleRoutes from './routes/repairSchedule.route.js';
import otpRoutes from './routes/otp.route.js';
import checkoutRoutes from './routes/checkout.route.js';
import passwordRoutes from './routes/password.route.js';
import searchBarRoutes from './routes/search_bar.route.js'
import updateUser from './routes/user.route.js';
import bikeServiceRoutes from './routes/bikeService.route.js';
import orderRoutes from './routes/order.route.js';
import orderEmailRoutes from './routes/orderEmail.route.js';
import testRoutes from './routes/test.route.js';
dotenv.config();

// Add this line to serve the uploads folder publicly

const PORT = process.env.PORT || 5000

// Before defining routes

const app = express();

// ✅ Increase limit to handle base64 image
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static('uploads'));

app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes)
app.use("/api/postEmails", emailRoutes)
app.use("/api/registerUser", userRouter)
app.use('/api/userDetails', userDetails);
app.use('/api/updateUser', updateUser);
app.use('/api/loginDetails', userLoginRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/repair-schedule", repairScheduleRoutes);
app.use("/api/otp", otpRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/checkout/success', userLoginRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/search', searchBarRoutes);
app.use('/api/bike-service', bikeServiceRoutes);
app.use('/api/orders', orderRoutes);
app.use("/api/orderEmails", orderEmailRoutes);
app.use("/api/tests", testRoutes);

// Serve static files (React frontend)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.listen(5000, () => {
  connectDB();
  console.log('Server Started at http://localhost:' + PORT);
})