const nodemailer = require('nodemailer');

// Create a transporter using Gmail SMTP credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',  // Use Gmail's SMTP service
  auth: {
    user: 'dkavinda403@gmail.com',  // Your Gmail address
    pass: 'xbbh wiis cnds ioak',  // Your Gmail App password (NOT your Google password)
  },
  tls: {
    rejectUnauthorized: false,  // This allows self-signed certificates
}});

const sendEmailController = (req, res) => {
  try {
    const { name, email, msg } = req.body;

    // Validation
    if (!name || !email || !msg) {
      return res.status(400).send({
        success: false,
        message: "Please Provide All Fields",
      });
    }

    // Send the email
    transporter.sendMail({
      to: "kavindad834@gmail.com",
      from: "dkavinda403@gmail.com", 
      subject: "Regarding Bifix",
      html: `
        <h5>Detail Information</h5>
        <ul>
          <li><p>Name : ${name}</p></li>
          <li><p>Email : ${email}</p></li>
          <li><p>Message : ${msg}</p></li>
        </ul>
      `,
    });

    return res.status(200).send({
      success: true,
      message: "Your Message Send Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Send Email API Error",
      error,
    });
  }
};
module.exports = { sendEmailController };
