"use client";

import { useState } from "react";
import { Check, X, Star, ArrowRight } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for trying out the platform",
    features: [
      { text: "3 Events per month", included: true },
      { text: "50 Photos per event", included: true },
      { text: "1 Album per event", included: true },
      { text: "5MB max file size", included: true },
      { text: "7-day QR code expiry", included: true },
      { text: "Download photos", included: true },
      { text: "Bulk download", included: false },
      { text: "Custom branding", included: false },
      { text: "Priority support", included: false },
    ],
    color: "bg-gray-50",
    buttonColor: "bg-gray-600 hover:bg-gray-700",
    popular: false,
  },
  {
    name: "Pro",
    price: "$9.99",
    description: "Great for regular event organizers",
    features: [
      { text: "20 Events per month", included: true },
      { text: "500 Photos per event", included: true },
      { text: "3 Albums per event", included: true },
      { text: "10MB max file size", included: true },
      { text: "30-day QR code expiry", included: true },
      { text: "Download photos", included: true },
      { text: "Bulk download", included: true },
      { text: "Custom branding", included: false },
      { text: "Priority support", included: true },
    ],
    color: "bg-indigo-50",
    buttonColor: "bg-indigo-600 hover:bg-indigo-700",
    popular: true,
  },
  {
    name: "Premium",
    price: "$29.99",
    description: "For professional event organizers",
    features: [
      { text: "Unlimited Events", included: true },
      { text: "Unlimited Photos", included: true },
      { text: "Unlimited Albums", included: true },
      { text: "25MB max file size", included: true },
      { text: "QR codes never expire", included: true },
      { text: "Download photos", included: true },
      { text: "Bulk download", included: true },
      { text: "Custom branding", included: true },
      { text: "Priority support", included: true },
    ],
    color: "bg-purple-50",
    buttonColor: "bg-purple-600 hover:bg-purple-700",
    popular: false,
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (planName: string) => {
    setLoading(planName);
    
    try {
      const response = await fetch("/payment/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: planName.toUpperCase(),
          successUrl: `${window.location.origin}/dashboard?success=true`,
          cancelUrl: `${window.location.origin}/pricing?cancelled=true`,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (planName === "Free") {
          // Free plan activated, redirect to dashboard
          window.location.href = "/dashboard";
        } else {
          // Redirect to Stripe checkout
          window.location.href = data.url;
        }
      } else {
        alert(data.message || "Failed to start subscription");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      alert("Failed to start subscription. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start collecting photos from your events with a plan that fits your needs
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border-2 ${
                plan.popular
                  ? "border-indigo-500 shadow-xl"
                  : "border-gray-200"
              } ${plan.color} p-8`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-indigo-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Star size={14} />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {plan.price}
                  <span className="text-lg text-gray-600 font-normal">/month</span>
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </div>

              <div className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    {feature.included ? (
                      <Check className="text-green-500 mt-0.5" size={18} />
                    ) : (
                      <X className="text-gray-400 mt-0.5" size={18} />
                    )}
                    <span
                      className={`${
                        feature.included ? "text-gray-900" : "text-gray-400"
                      }`}
                    >
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleSubscribe(plan.name)}
                disabled={loading === plan.name}
                className={`w-full py-3 px-6 rounded-xl font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${plan.buttonColor}`}
              >
                {loading === plan.name ? (
                  "Processing..."
                ) : plan.name === "Free" ? (
                  "Get Started"
                ) : (
                  "Subscribe Now"
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="font-semibold mb-2">Can I change my plan later?</h3>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="font-semibold mb-2">What happens if I exceed my limits?</h3>
              <p className="text-gray-600">
                You'll be prompted to upgrade your plan when you reach your event or photo limits.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="font-semibold mb-2">Do my photos expire?</h3>
              <p className="text-gray-600">
                Photos are stored permanently. Only QR codes have expiry dates based on your plan.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="font-semibold mb-2">Is there a contract?</h3>
              <p className="text-gray-600">
                No contracts! You can cancel your subscription at any time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
