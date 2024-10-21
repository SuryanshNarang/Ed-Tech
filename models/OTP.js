const mongoose = require("mongoose");
const mailSender = require('../utils/mailSender');
const otpTemplate = require('../mail/templates/emailVerificationTemplate'); // Adjust path as necessary
const otpGenerator = require('otp-generator'); // Ensure you have this installed and imported

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '5m', // OTP will expire after 5 minutes
  }
});

async function sendVerificationEmail(email, otp) {
  try {
    const emailBody = otpTemplate(otp); // Call the template function
    const mailResponse = await mailSender(email, "Verification Email from StudyNotion", emailBody);
    console.log("Mail sent successfully", mailResponse);
  } catch (error) {
    console.log("Error occurred while sending Mail", error);
    throw new Error('Failed to send verification email');
  }
}

// Pre-save middleware
otpSchema.pre("save", async function (next) {
  await sendVerificationEmail(this.email, this.otp);
  next();
});

module.exports = mongoose.model('OTP', otpSchema);
