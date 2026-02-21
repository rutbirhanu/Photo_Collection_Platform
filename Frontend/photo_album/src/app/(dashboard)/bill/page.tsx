"use client";

import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hook";
import { Crown, Zap, Star, TrendingUp, Users, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

const PLANS = {
  FREE: {
    name: "Free",
    icon: Star,
    color: "text-gray-600",
    bgColor: "bg-gray-100",
    borderColor: "border-gray-300",
    features: ["50 photos per event", "Basic QR codes", "1 event"],
    uploadLimit: 50,
  },
  PRO: {
    name: "Pro",
    icon: Zap,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-500",
    features: ["500 photos per event", "Custom QR codes", "5 events", "Priority support"],
    uploadLimit: 500,
  },
  PREMIUM: {
    name: "Premium",
    icon: Crown,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    borderColor: "border-purple-500",
    features: ["Unlimited photos", "Advanced analytics", "Unlimited events", "24/7 support"],
    uploadLimit: Infinity,
  },
};

export default function BillingPage() {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [userStats, setUserStats] = useState({
    totalEvents: 0,
    totalPhotos: 0,
    uploadsUsed: 0,
    uploadLimit: 50,
    plan: 'FREE'
  });

  useEffect(() => {
    // Fetch fresh user data and stats from backend
    const fetchUserData = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

        // Fetch fresh user data
        const userResponse = await fetch(`${backendUrl}/auth/fetch-current-user`, {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        // Fetch user stats
        const statsResponse = await fetch(`${backendUrl}/auth/user-stats`, {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (userResponse.ok && statsResponse.ok) {
          const userData = await userResponse.json();
          const stats = await statsResponse.json();

          // Update Redux with fresh user data
          dispatch({ type: 'auth/fetchCurrentUser/fulfilled', payload: userData });

          // Set stats with the fresh plan from user data
          setUserStats({
            ...stats,
            plan: userData.plan
          });
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const currentPlan = PLANS[userStats.plan?.toUpperCase() as keyof typeof PLANS] || PLANS.FREE;
  const Icon = currentPlan.icon;
  const remainingUploads = currentPlan.uploadLimit === Infinity ? "Unlimited" :
    Math.max(0, currentPlan.uploadLimit - userStats.uploadsUsed);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing & Subscription</h1>
        <p className="text-gray-600">Manage your subscription and track your usage</p>
      </div>

      {/* Current Plan Overview */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${currentPlan.bgColor}`}>
              <Icon className={`w-8 h-8 ${currentPlan.color}`} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{currentPlan.name} Plan</h2>
              <p className="text-gray-600">Your current subscription</p>
            </div>
          </div>
          <Link
            href="/pricing"
            className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors"
          >
            Upgrade Plan
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-600">Total Events</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{userStats.totalEvents}</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <ImageIcon className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-600">Total Photos</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{userStats.totalPhotos}</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-600">Uploads Remaining</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{remainingUploads}</p>
          </div>
        </div>
      </div>

      {/* Plan Features */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Your Plan Features</h3>
        <div className="space-y-4">
          {currentPlan.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${currentPlan.color} ${currentPlan.bgColor.replace('bg-', 'bg-opacity-20 text-')}`}></div>
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Usage Progress */}
      {currentPlan.uploadLimit !== Infinity && (
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Storage Usage</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Photos Uploaded</span>
                <span className="font-medium text-gray-900">
                  {userStats.uploadsUsed} / {currentPlan.uploadLimit}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${userStats.uploadsUsed / currentPlan.uploadLimit > 0.8
                    ? 'bg-red-500'
                    : userStats.uploadsUsed / currentPlan.uploadLimit > 0.6
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                    }`}
                  style={{
                    width: `${Math.min(100, (userStats.uploadsUsed / currentPlan.uploadLimit) * 100)}%`
                  }}
                ></div>
              </div>
            </div>

            {userStats.uploadsUsed / currentPlan.uploadLimit > 0.8 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  ⚠️ You're approaching your upload limit. Consider upgrading your plan for more storage.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
