// filepath: d:\6th Sem\Software_Project\Bike_repair\Software-Project\backend\server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const userRoutes = require("./routes/UserRoutes");
const { sendEmailController } = require("./controllers/SendEmailController");

// dotenv configuration
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.post("/api/v1/bifix/sendEmail", sendEmailController);
app.use("/api/v1/users",userRoutes );

// Serve static files (React frontend)
app.use(express.static(path.join(__dirname, "../bifix/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../bifix/build/index.html"));
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});