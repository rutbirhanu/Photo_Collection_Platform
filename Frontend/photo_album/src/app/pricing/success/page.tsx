"use client";

import { Suspense, useEffect, useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    const planParam = searchParams.get("plan");

    if (planParam) {
      setPlan(planParam);
    }

    // Simulate processing time for better UX
    setTimeout(() => {
      setLoading(false);
    }, 2000);

    // You could also verify session with your backend here
    if (sessionId) {
      // verifyPaymentSession(sessionId);
    }
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 text-green-500 animate-spin mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Processing your payment...
          </h1>
          <p className="text-gray-600">
            Please wait while we confirm your subscription
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            {plan ? `Welcome to the ${plan} plan!` : "Your subscription has been activated successfully."}
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              What's Next?
            </h2>
            <ul className="text-left space-y-3 text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                <span>Your account has been upgraded</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                <span>New features are now available</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                <span>Manage your subscription anytime</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => router.push("/event")}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Go to Events
            </button>

            <button
              onClick={() => router.push("/pricing")}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors"
            >
              View Plans
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <Loader2 className="h-16 w-16 text-green-500 animate-spin" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
