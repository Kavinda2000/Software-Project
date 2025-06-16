import express from "express"
import { registerUser, userDetails, updateUser } from "../controllers/UserController.js"


const router = express.Router()
router.post("/", registerUser)
router.get("/", userDetails) // Get user details by email;
router.put("/:email", updateUser)

export default router
