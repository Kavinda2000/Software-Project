import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: String, // storing user email or userId
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      title: {
        type: String,
        required: true, // snapshot of product title
      },
      price: {
        type: Number,
        required: true, // snapshot of price at purchase time
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      image: {
        type: String,
        default: "",
      },
    },
  ],
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Pending",
  },
  address: {
    type: String,
    required: true, // shipping address
  },
  paymentMethod: {
    type: String,
    enum: ["Cash on Delivery", "Credit Card", "Debit Card", "UPI", "PayPal"],
    default: "Cash on Delivery",
  },
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);

export default Order;
