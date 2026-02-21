// const stripe = require("../config/stripeConfig.js");
// const prisma = require("../config/dbConfig.js");
// const { PLANS } = require("../config/plans.js");

// exports.createCheckout = async (req, res) => {
//   try {
//     const { plan, successUrl, cancelUrl } = req.body;
//     const userId = req.user.id;

//     // Validate plan
//     if (!PLANS[plan]) {
//       return res.status(400).json({ message: "Invalid plan" });
//     }

//     // Free plan doesn't need payment
//     if (plan === 'FREE') {
//       // Update user to free plan immediately
//       await prisma.user.update({
//         where: { id: userId },
//         data: { plan: 'FREE' }
//       });

//       return res.json({
//         message: "Free plan activated",
//         plan: 'FREE'
//       });
//     }

//     const selectedPlan = PLANS[plan];

//     // Create or get Stripe customer
//     let customer;
//     const existingUser = await prisma.user.findUnique({
//       where: { id: userId },
//       select: { stripeCustomerId: true }
//     });

//     if (existingUser.stripeCustomerId) {
//       customer = await stripe.customers.retrieve(existingUser.stripeCustomerId);
//     } else {
//       customer = await stripe.customers.create({
//         email: req.user.email,
//         metadata: { userId }
//       });

//       await prisma.user.update({
//         where: { id: userId },
//         data: { stripeCustomerId: customer.id }
//       });
//     }

//     // Create checkout session
//     const session = await stripe.checkout.sessions.create({
//       customer: customer.id,
//       payment_method_types: ["card"],
//       mode: "subscription",
//       line_items: [{
//         price_data: {
//           currency: "usd",
//           product_data: {
//             name: `${selectedPlan.name} Plan`,
//             description: `Photo collection platform - ${selectedPlan.name} features`,
//             images: []
//           },
//           unit_amount: selectedPlan.price,
//           recurring: {
//             interval: "month"
//           }
//         },
//         quantity: 1,
//       }],
//       metadata: {
//         userId,
//         plan
//       },
//       success_url: successUrl || `${process.env.FRONTEND_URL}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: cancelUrl || `${process.env.FRONTEND_URL}/pricing?cancelled=true`,
//     });

//     // Create payment record
//     await prisma.payment.create({
//       data: {
//         userId,
//         stripeSessionId: session.id,
//         amount: selectedPlan.price,
//         currency: "usd",
//         status: "PENDING",
//         plan: plan
//       }
//     });

//     res.json({ url: session.url });
//   } catch (error) {
//     console.error("Create checkout error:", error);
//     res.status(500).json({ message: "Failed to create checkout session" });
//   }
// };

// exports.stripeWebhook = async (req, res) => {
//   const sig = req.headers["stripe-signature"];
//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(
//       req.body,
//       sig,
//       process.env.STRIPE_WEBHOOK_SECRET
//     );
//   } catch (err) {
//     console.error("Webhook signature verification failed:", err);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   try {
//     switch (event.type) {
//       case "checkout.session.completed":
//         await handleCheckoutCompleted(event.data.object);
//         break;
//       case "invoice.payment_succeeded":
//         await handlePaymentSucceeded(event.data.object);
//         break;
//       case "invoice.payment_failed":
//         await handlePaymentFailed(event.data.object);
//         break;
//       case "customer.subscription.deleted":
//         await handleSubscriptionCancelled(event.data.object);
//         break;
//       default:
//         console.log(`Unhandled event type: ${event.type}`);
//     }

//     res.json({ received: true });
//   } catch (error) {
//     console.error("Webhook processing error:", error);
//     res.status(500).json({ message: "Webhook processing failed" });
//   }
// };

// async function handleCheckoutCompleted(session) {
//   const { userId, plan } = session.metadata;

//   // Update payment record
//   await prisma.payment.updateMany({
//     where: { stripeSessionId: session.id },
//     data: {
//       status: "PAID",
//       paidAt: new Date(),
//       stripePaymentIntent: session.payment_intent
//     }
//   });

//   // Update user plan and subscription
//   await prisma.user.update({
//     where: { id: userId },
//     data: {
//       plan,
//       subscriptionId: session.subscription,
//       subscriptionStatus: "ACTIVE"
//     }
//   });

//   console.log(`User ${userId} upgraded to ${plan} plan`);
// }

// async function handlePaymentSucceeded(invoice) {
//   const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
//   const customerId = subscription.customer;

//   // Find user by Stripe customer ID
//   const user = await prisma.user.findUnique({
//     where: { stripeCustomerId: customerId }
//   });

//   if (user) {
//     await prisma.user.update({
//       where: { id: user.id },
//       data: { subscriptionStatus: "ACTIVE" }
//     });
//   }
// }

// async function handlePaymentFailed(invoice) {
//   const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
//   const customerId = subscription.customer;

//   const user = await prisma.user.findUnique({
//     where: { stripeCustomerId: customerId }
//   });

//   if (user) {
//     await prisma.user.update({
//       where: { id: user.id },
//       data: { subscriptionStatus: "CANCELLED" }
//     });
//   }
// }

// async function handleSubscriptionCancelled(subscription) {
//   const customerId = subscription.customer;

//   const user = await prisma.user.findUnique({
//     where: { stripeCustomerId: customerId }
//   });

//   if (user) {
//     await prisma.user.update({
//       where: { id: user.id },
//       data: {
//         subscriptionStatus: "CANCELLED",
//         plan: "FREE" // Downgrade to free plan
//       }
//     });
//   }
// }

// exports.getSubscriptionStatus = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//       select: {
//         plan: true,
//         subscriptionStatus: true,
//         subscriptionId: true,
//         payments: {
//           where: { status: "PAID" },
//           orderBy: { createdAt: "desc" },
//           take: 1
//         }
//       }
//     });

//     res.json({
//       plan: user.plan,
//       subscriptionStatus: user.subscriptionStatus,
//       subscriptionId: user.subscriptionId,
//       lastPayment: user.payments[0] || null
//     });
//   } catch (error) {
//     console.error("Get subscription status error:", error);
//     res.status(500).json({ message: "Failed to get subscription status" });
//   }
// };

// exports.cancelSubscription = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//       select: { subscriptionId: true, stripeCustomerId: true }
//     });

//     if (!user.subscriptionId) {
//       return res.status(400).json({ message: "No active subscription" });
//     }

//     // Cancel subscription in Stripe
//     await stripe.subscriptions.cancel(user.subscriptionId);

//     // Update user in database
//     await prisma.user.update({
//       where: { id: userId },
//       data: {
//         subscriptionStatus: "CANCELLED",
//         plan: "FREE"
//       }
//     });

//     res.json({ message: "Subscription cancelled successfully" });
//   } catch (error) {
//     console.error("Cancel subscription error:", error);
//     res.status(500).json({ message: "Failed to cancel subscription" });
//   }
// };
