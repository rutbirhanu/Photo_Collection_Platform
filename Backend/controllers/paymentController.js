import Stripe from "stripe";
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
  const event = req.body;

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    await prisma.payment.create({
      data: {
        userId: session.client_reference_id,
        stripeId: session.id,
        amount: session.amount_total,
        status: "paid",
        plan: session.metadata.plan,
      },
    });

    await prisma.user.update({
      where: { id: session.client_reference_id },
      data: {
        isActive: true,
        plan: session.metadata.plan,
        maxGuests: PLAN.guests,
        maxPhotos: PLAN.photos,
      },
    });
  }

  res.sendStatus(200);
};
