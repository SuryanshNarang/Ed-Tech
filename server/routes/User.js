const express = require("express");
const router = express.Router();

// Import the authentication controllers
const { login, signup, sendOTP, changePassword } = require("../controllers/Auth");
const { resetPasswordToken, resetPassword } = require("../controllers/ResetPassword");
const { auth } = require("../middlewares/authMiddleware");

// ********************************************
//              Authentication routes
// ********************************************

// Route for user login
router.post("/login", login);

// Route for user signup
router.post("/signup", signup);

// Route to send OTP (for password reset, email verification, etc.)
router.post("/sendOTP", sendOTP);  // Make sure to use `sendOTP` here

// Route to change user password
// Protected route, requires user authentication
router.post("/change-password", auth, changePassword);

// Route to initiate password reset (sends token to user)
router.post("/reset-password-token", resetPasswordToken);

// Route to reset password using the token
router.post("/reset-password", resetPassword);

module.exports = router;
