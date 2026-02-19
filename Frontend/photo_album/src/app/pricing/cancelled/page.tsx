"use client";

import { useEffect, useState } from "react";
import { XCircle, RefreshCw, Home } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function PaymentCancelledPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [plan, setPlan] = useState<string | null>(null);

  useEffect(() => {
    const planParam = searchParams.get("plan");
    if (planParam) {
      setPlan(planParam);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-6">
            <XCircle className="h-10 w-10 text-yellow-500" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Cancelled
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            {plan ? `Your ${plan} plan subscription was cancelled.` : "The payment process was cancelled."}
            <br />
            No charges were made to your account.
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Changed your mind?
            </h2>
            <ul className="text-left space-y-3 text-gray-600">
              <li className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-blue-500 shrink-0" />
                <span>You can subscribe anytime</span>
              </li>
              <li className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-blue-500 shrink-0" />
                <span>Try a different plan</span>
              </li>
              <li className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-blue-500 shrink-0" />
                <span>Free plan is always available</span>
              </li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-yellow-800">
              <strong>Remember:</strong> Your current plan limits still apply. 
              Upgrade anytime to unlock more features.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => router.push("/pricing")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="h-5 w-5" />
              Try Again
            </button>
            
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Home className="h-5 w-5" />
              Back to Dashboard
            </button>
          </div>

          <div className="mt-6 text-sm text-gray-500">
            <p>You can always upgrade later from your dashboard settings.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
