"use client";

import { useEffect, useState } from "react";
import { XCircle, RefreshCw, Home } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function PaymentErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const errorParam = searchParams.get("error");
    const cancelled = searchParams.get("cancelled");
    
    if (cancelled === "true") {
      setError("Payment was cancelled. You can try again anytime.");
    } else if (errorParam) {
      setError(decodeURIComponent(errorParam));
    } else {
      setError("Something went wrong with your payment. Please try again.");
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
            <XCircle className="h-10 w-10 text-red-500" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Failed
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            {error || "We couldn't process your payment at this time."}
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              What can you do?
            </h2>
            <ul className="text-left space-y-3 text-gray-600">
              <li className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-blue-500 shrink-0" />
                <span>Try a different payment method</span>
              </li>
              <li className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-blue-500 shrink-0" />
                <span>Check your card details and try again</span>
              </li>
              <li className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-blue-500 shrink-0" />
                <span>Contact your bank if the issue persists</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-blue-800">
              <strong>Need help?</strong> If you continue to experience issues, 
              please contact our support team and we'll be happy to assist you.
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
            <p>Reference ID: {Date.now()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
