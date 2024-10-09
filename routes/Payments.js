// routes/paymentRoutes.js

const express = require("express");
const router = express.Router();
const { capturePayment, verifySignature } = require("../controllers/paymentController");
const authMiddleware = require("../middleware/authMiddleware");

// Route to capture payment
// Protected route, requires user authentication
router.post("/capture-payment", authMiddleware, capturePayment);

// Route to verify payment signature
// This route should match Razorpay webhook settings for signature verification
router.post("/verify-signature", verifySignature);

module.exports = router;
