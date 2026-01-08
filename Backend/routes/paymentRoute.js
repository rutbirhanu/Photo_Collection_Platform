const express = require("express");
const { createCheckout, stripeWebhook} = require("../controllers/paymentController.js");
const router = express.Router();

router.post("/checkout", createCheckout);
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

module.exports = router;
