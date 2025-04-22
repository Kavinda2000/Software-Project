
// filepath: d:\6th Sem\Software_Project\Bike_repair\Software-Project\backend\controllers\SendEmailController.js
const sendEmailController = (req, res) => {
    res.status(200).json({ success: true, message: "Email sent successfully" });
  };
  
  module.exports = { sendEmailController };
