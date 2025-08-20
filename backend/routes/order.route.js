import express from "express";
import { 
  createOrder, 
  getUserOrders, 
  getVendorOrders, 
  deleteOrder 
} from "../controllers/orders.controller.js";

const router = express.Router();

// Create a new order (customer places order)
router.post("/", createOrder);

// Get orders of a specific customer (by email)
router.get("/user/:email", getUserOrders);

// Get orders for a vendor (by owner email)
router.get("/vendor/:ownerEmail", getVendorOrders);

// Delete an order
router.delete("/:id", deleteOrder);

export default router;
