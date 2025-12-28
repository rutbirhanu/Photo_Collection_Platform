import stripe from "../config/stripeConfig.js";
import prisma from "../config/dbConfig.js";

const stripe = new Stripe(process.env.STRIPE_SECRET);

export const createCheckout = async (req, res) => {
  const { plan } = req.body;

  const PLANS = {
    FREE: { price: 0, guests: 20, photos: 100 },
    BASIC: { price: 2000, guests: 100, photos: 1000 },
    PRO: { price: 5000, guests: 500, photos: 10000 }
  };

  const selected = PLANS[plan];

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [{
      price_data: {
        currency: "usd",
        product_data: { name: `${plan} Plan` },
        unit_amount: selected.price,
      },
      quantity: 1,
    }],
    success_url: "https://yourapp.com/success",
    cancel_url: "https://yourapp.com/cancel",
  });

  res.json({ url: session.url });
};




export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const plan = session.metadata.plan;
    const planConfig = PLANS[plan];

    await prisma.payment.create({
      data: {
        userId: session.client_reference_id,
        stripeId: session.id,
        amount: session.amount_total,
        currency: session.currency,
        plan,
        status: "paid",
      },
    });

    await prisma.user.update({
      where: { id: session.client_reference_id },
      data: {
        isActive: true,
        plan,
        maxGuests: planConfig.guests,
        maxPhotos: planConfig.photos,
      },
    });
  }

  res.json({ received: true });
};









const PLANS = {
  FREE: { price: 0, guests: 20, photos: 100 },
  BASIC: { price: 2000, guests: 100, photos: 1000 },
  PRO: { price: 5000, guests: 500, photos: 10000 },
};

export const createCheckoutSession = async (req, res) => {
  const { plan } = req.body;
  const user = req.user;

  if (!PLANS[plan]) {
    return res.status(400).json({ message: "Invalid plan" });
  }

  const selectedPlan = PLANS[plan];

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    client_reference_id: user.id,
    metadata: { plan },
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: `${plan} Plan` },
          unit_amount: selectedPlan.price,
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.FRONTEND_URL}/payment-success`,
    cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
  });

  res.json({ url: session.url });
};
