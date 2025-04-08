const express = require("express");
const { registerUser } = require("../controllers/UserController");

const router = express.Router();

// Route for user registration
router.post("/register", registerUser);

module.exports = router;