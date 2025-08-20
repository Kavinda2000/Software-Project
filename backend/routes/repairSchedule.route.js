import express from "express";
import { createSchedule } from "../controllers/Shedule.controller.js";


const router = express.Router();

router.post("/", createSchedule);


export default router;
