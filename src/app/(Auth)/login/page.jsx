"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../../lib/authSlice";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    if (auth.user) {
      router.push("/");
    }
  }, [auth.user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.status === 200) {
        dispatch(loginSuccess({ user: data.user, token: data.token }));
        router.push("/");
      } else {
        setErrorMsg(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMsg("Something went wrong");
    }

    setLoading(false);
  };

  const handleForgotPasswordClick = () => {
    router.push("/forgot-password");
  };

  const handleCreateAccountClick = () => {
    router.push("/register");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 leading-tight">
            Rustam Industry Finance <br /> Management System
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Sign in to your admin account to continue
          </p>
        </div>

        {errorMsg && (
          <p className="text-red-600 text-center text-sm mb-4">{errorMsg}</p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full mt-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full mt-1 px-4 py-2 pr-20 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-sm text-blue-600 hover:underline focus:outline-none"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600">
              <input type="checkbox" className="form-checkbox" />
              Remember me
            </label>
            <button
              type="button"
              onClick={handleForgotPasswordClick}
              className="text-blue-600 hover:underline focus:outline-none"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold transition duration-200"
          >
            {loading ? "Logging in..." : "Sign In"}
          </button>
        </form>

        <div className="text-center mt-6">
          <span className="text-sm text-gray-600">Don't have an account? </span>
          <button
            type="button"
            onClick={handleCreateAccountClick}
            className="text-blue-600 hover:underline text-sm focus:outline-none"
          >
            Create New Account
          </button>
        </div>
      </div>
    </div>
  );
}
