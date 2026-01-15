"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { User, Mail, Lock } from "lucide-react";
import { register, clearAuthError } from "@/redux/authSlice";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { loading, error, user } = useAppSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(register(form));
  };

  // Redirect on success
  useEffect(() => {
    if (user) {
      router.push("/auth/login");
    }
  }, [user, router]);

  // Clear error on unmount
  useEffect(() => {
    return () => dispatch(clearAuthError());
  }, [dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-neutral-50 text-neutral-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl w-full max-w-sm shadow-lg border border-neutral-200"
      >
        <h1 className="text-2xl font-bold mb-2 text-center">
          Create your account
        </h1>
        <p className="text-sm text-neutral-500 text-center mb-6">
          Start collecting photos from your events in minutes
        </p>

        {/* Name */}
        <div className="relative mb-4">
          <User className="absolute left-3 top-3.5 w-5 h-5 text-neutral-400" />
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full pl-11 p-3 rounded-lg border border-neutral-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Full name"
            required
          />
        </div>

        {/* Email */}
        <div className="relative mb-4">
          <Mail className="absolute left-3 top-3.5 w-5 h-5 text-neutral-400" />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full pl-11 p-3 rounded-lg border border-neutral-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Email"
            required
          />
        </div>

        {/* Password */}
        <div className="relative mb-6">
          <Lock className="absolute left-3 top-3.5 w-5 h-5 text-neutral-400" />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full pl-11 p-3 rounded-lg border border-neutral-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Password"
            required
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-500 mb-3 text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-500 hover:bg-indigo-600 w-full py-3 rounded-lg font-medium text-white transition disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-neutral-200" />
          <span className="px-3 text-sm text-neutral-500">OR</span>
          <div className="flex-1 h-px bg-neutral-200" />
        </div>

        {/* Google Signup (future) */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 py-3 rounded-lg border border-neutral-300 bg-white font-medium text-neutral-900 hover:bg-neutral-100 transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        {/* Footer */}
        <p className="text-sm text-neutral-500 text-center mt-6">
          Already have an account?{" "}
          <a href="/auth/login" className="text-indigo-500 hover:underline">
            Log in
          </a>
        </p>
      </form>
    </div>
  );
}
