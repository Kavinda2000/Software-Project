import mongoose from "mongoose";
import Order from "../models/orders.js";
import Product from "../models/Products.js";

// Create a new order
export const createOrder = async (req, res) => {
  const { user, products, address, paymentMethod } = req.body;

  if (!user || !products || products.length === 0 || !address) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields (user, products, address)",
    });
  }

  try {
    let total = 0;

    // Verify products & calculate total
    const orderProducts = await Promise.all(
      products.map(async (p) => {
        const product = await Product.findById(p.productId);
        if (!product) throw new Error(`Product not found: ${p.productId}`);

        const itemTotal = product.price * p.quantity;
        total += itemTotal;

        return {
          productId: product._id,
          title: product.title,
          price: product.price,
          quantity: p.quantity,
          image: product.image,
        };
      })
    );

    const newOrder = new Order({
      user,
      products: orderProducts,
      total,
      address,
      paymentMethod,
    });

    await newOrder.save();
    res.status(201).json({ success: true, data: newOrder });
  } catch (error) {
    console.error("Error creating order:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get orders of a specific customer
export const getUserOrders = async (req, res) => {
  const { email } = req.params;

  try {
    const orders = await Order.find({ user: email }).populate(
      "products.productId",
      "owner title brand category"
    );
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching user orders:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get orders for a specific vendor (product owner)
export const getVendorOrders = async (req, res) => {
  const { ownerEmail } = req.params;

  try {
    // Find products owned by this vendor
    const ownedProducts = await Product.find({ owner: ownerEmail }).select("_id");

    const ownedProductIds = ownedProducts.map((p) => p._id);

    // Find orders that include these products
    const vendorOrders = await Order.find({
      "products.productId": { $in: ownedProductIds },
    }).populate("products.productId", "owner title brand category");

    res.status(200).json({ success: true, data: vendorOrders });
  } catch (error) {
    console.error("Error fetching vendor orders:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Delete an order
export const deleteOrder = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Order ID" });
  }

  try {
    await Order.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Order deleted" });
  } catch (error) {
    console.error("Error deleting order:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


// Update order status
export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ success: false, message: "Status is required" });
  }

  try {
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    order.status = status;
    await order.save();

    res.status(200).json({ success: true, data: order });
  } catch (err) {
    console.error("Error updating order status:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};