import express from "express"
import { registerUser, userDetails } from "../controllers/UserController.js"


const router = express.Router()
router.post("/", registerUser)
router.get("/", userDetails) // Get user details by email;

export default router
