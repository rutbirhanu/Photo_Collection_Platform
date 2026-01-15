"use client";
import { useEffect, useState } from "react";
import { Mail, Lock } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/redux/authSlice";
import { useAppSelector, useAppDispatch } from "@/redux/hook";
import { useRouter } from "next/navigation"; 


export default function LoginPage() {
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/event"); // Redirect to home page
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-neutral-50 text-neutral-900">
      <div className="bg-white p-8 rounded-2xl w-full max-w-sm shadow-lg border border-neutral-200">
        <h1 className="text-2xl font-bold mb-6 text-center">Welcome back</h1>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="relative mb-4">
            <Mail className="absolute left-3 top-3.5 w-5 h-5 text-neutral-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 p-3 rounded-lg border border-neutral-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Email"
            />
          </div>

          {/* Password */}
          <div className="relative mb-6">
            <Lock className="absolute left-3 top-3.5 w-5 h-5 text-neutral-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 p-3 rounded-lg border border-neutral-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-500 hover:bg-indigo-600 w-full py-3 rounded-lg font-medium text-white transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-neutral-200" />
          <span className="px-3 text-sm text-neutral-500">OR</span>
          <div className="flex-1 h-px bg-neutral-200" />
        </div>

        {/* Google Login */}
        <button className="w-full flex items-center justify-center gap-3 py-3 rounded-lg border border-neutral-300 bg-white font-medium text-neutral-900 hover:bg-neutral-100 transition">
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        {/* Footer */}
        <p className="text-sm text-neutral-500 text-center mt-6">
          Don’t have an account?{" "}
          <a href="/auth/signup" className="text-indigo-500 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
