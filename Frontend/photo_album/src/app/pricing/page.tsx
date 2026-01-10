import { Check } from "lucide-react";

export default function PricingPage() {
  const plans = [
    {
      name: "Basic",
      price: "$9",
      description: "Perfect for small gatherings and private events",
      photos: 50,
      features: [
        "Up to 50 photos per event",
        "QR code guest upload",
        "Basic album gallery",
        "Email support",
      ],
    },
    {
      name: "Pro",
      price: "$19",
      description: "Best for weddings, parties, and corporate events",
      photos: 200,
      highlighted: true,
      features: [
        "Up to 200 photos per event",
        "Unlimited guests",
        "High-quality image uploads",
        "Event & album management",
        "Priority support",
      ],
    },
    {
      name: "Unlimited",
      price: "$39",
      description: "For professionals and frequent event hosts",
      photos: "Unlimited",
      features: [
        "Unlimited photo uploads",
        "Unlimited guests & events",
        "Advanced album gallery",
        "Cloud backup & fast delivery",
        "Premium support",
      ],
    },
  ];

  return (
    <div className="min-h-screen px-6 py-20 bg-neutral-50 text-neutral-900">
      <h1 className="text-4xl font-bold text-center mb-4">
        Simple, Transparent Pricing
      </h1>
      <p className="text-neutral-600 text-center mb-12">
        Pay once per event. No apps for guests. Just scan & upload.
      </p>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-2xl p-8 border bg-white transition ${
              plan.highlighted
                ? "border-indigo-500 shadow-lg shadow-indigo-500/20"
                : "border-neutral-200"
            }`}
          >
            <h2 className="text-2xl font-semibold mb-2">{plan.name}</h2>
            <p className="text-neutral-600 mb-6">{plan.description}</p>

            <p className="text-4xl font-bold mb-1">{plan.price}</p>
            <p className="text-sm text-neutral-500 mb-6">
              {plan.photos} photos per event
            </p>

            <ul className="space-y-3 mb-8 text-left">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-indigo-500" />
                  <span className="text-neutral-700">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              className={`w-full py-3 rounded-lg font-medium transition ${
                plan.highlighted
                  ? "bg-indigo-500 hover:bg-indigo-600 text-white"
                  : "bg-neutral-100 hover:bg-neutral-200 text-neutral-900"
              }`}
            >
              Choose {plan.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
