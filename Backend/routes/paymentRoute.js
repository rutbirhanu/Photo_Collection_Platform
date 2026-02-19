const express = require("express");
const { createCheckout, stripeWebhook, getSubscriptionStatus, cancelSubscription } = require("../controllers/paymentController.js");
const verifyToken = require("../middleware/auth.js");
const router = express.Router();

// Protected routes
router.post("/checkout", verifyToken, createCheckout);
router.get("/status", verifyToken, getSubscriptionStatus);
router.post("/cancel", verifyToken, cancelSubscription);

// Webhook route (no auth needed)
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

module.exports = router;
