import { User, Mail, Lock, Chrome } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-neutral-900 p-8 rounded-2xl w-full max-w-sm shadow-lg">
        <h1 className="text-2xl font-bold mb-2 text-center">
          Create your account
        </h1>
        <p className="text-sm text-neutral-400 text-center mb-6">
          Start collecting photos from your events in minutes
        </p>

        {/* Name */}
        <div className="relative mb-4">
          <User className="absolute left-3 top-3.5 w-5 h-5 text-neutral-400" />
          <input
            className="w-full pl-11 p-3 rounded-lg bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Full name"
          />
        </div>

        {/* Email */}
        <div className="relative mb-4">
          <Mail className="absolute left-3 top-3.5 w-5 h-5 text-neutral-400" />
          <input
            type="email"
            className="w-full pl-11 p-3 rounded-lg bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Email"
          />
        </div>

        {/* Password */}
        <div className="relative mb-6">
          <Lock className="absolute left-3 top-3.5 w-5 h-5 text-neutral-400" />
          <input
            type="password"
            className="w-full pl-11 p-3 rounded-lg bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Password"
          />
        </div>

        <button className="bg-indigo-500 hover:bg-indigo-600 w-full py-3 rounded-lg font-medium transition">
          Sign Up
        </button>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-neutral-800" />
          <span className="px-3 text-sm text-neutral-400">OR</span>
          <div className="flex-1 h-px bg-neutral-800" />
        </div>

        {/* Google Signup */}
        <button
          className="w-full flex items-center justify-center gap-3 py-3 rounded-lg bg-white text-black font-medium hover:bg-neutral-100 transition"
        >
          <Chrome className="w-5 h-5" />
          Continue with Google
        </button>

        {/* Footer */}
        <p className="text-sm text-neutral-400 text-center mt-6">
          Already have an account?{" "}
          <a href="/auth/login" className="text-indigo-500 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
