import express from "express"
import { postEmail } from "../controllers/SendEmailController.js"


const router = express.Router()
router.post("/", postEmail)

export default router







