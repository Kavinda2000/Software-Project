import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Create transporter using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // your Gmail email
    pass: process.env.EMAIL_PASS, // app password if 2FA enabled
  },
  tls: { rejectUnauthorized: false },
});

// Send emails for new order
export const sendOrderEmail = async (req, res) => {
  try {
    const { customerName, customerEmail, vendorEmail, orderDetails } = req.body;

    if (!customerName || !customerEmail || !vendorEmail || !orderDetails) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Format order details as HTML
    const orderHtml = `
      <ul>
        <li><strong>Product:</strong> ${orderDetails.productTitle}</li>
        <li><strong>Quantity:</strong> ${orderDetails.quantity}</li>
        <li><strong>Total Price:</strong> Rs. ${orderDetails.totalPrice}</li>
        <li><strong>Payment Method:</strong> ${orderDetails.paymentMethod}</li>
        <li><strong>Shipping Address:</strong> ${orderDetails.shippingAddress}</li>
      </ul>
    `;

    // Email to customer
    await transporter.sendMail({
      to: customerEmail,
      from: process.env.EMAIL_USER,
      subject: "Order Confirmation - Thank you for your purchase!",
      html: `
        <h3>Hi ${customerName},</h3>
        <p>Thank you for your order. Here are the details:</p>
        ${orderHtml}
        <p>We will notify you once the order is shipped.</p>
      `,
    });

    // Email to vendor
    await transporter.sendMail({
      to: vendorEmail,
      from: process.env.EMAIL_USER,
      subject: "New Order Received",
      html: `
        <h3>Hi Vendor,</h3>
        <p>A new order has been placed. Here are the details:</p>
        ${orderHtml}
        <p>Please process this order as soon as possible.</p>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Order emails sent successfully",
    });

  } catch (error) {
    console.error("Error sending order emails:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send order emails",
      error: error.message,
    });
  }
};
