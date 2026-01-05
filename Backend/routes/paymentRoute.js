const express = require("express");
const { createCheckoutSession, stripeWebhook} = require("../controllers/paymentController.js");
const router = express.Router();

router.post("/checkout", createCheckoutSession);
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

module.exports = router;
