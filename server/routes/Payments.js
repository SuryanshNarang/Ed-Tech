const express = require("express");
const router = express.Router();
const paymentsController = require("../controllers/Payments"); // Adjust path as necessary

// Ensure you're correctly pointing to your controller functions
router.post("/capture-payment", paymentsController.capturePayment);
router.post("/verify-signature", paymentsController.verifySignature);

module.exports = router;

