"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../../../lib/authSlice";
import { MdOutlineMailOutline } from "react-icons/md";
import { CiLock } from "react-icons/ci";

import {
  buttonPrimary,
  inputBase,
  cardContainer,
  headingText,
  formLabel,
  linkText,
  pageWrapper,
  textCenter,
  formError,
  loginRedirectText,
  loginRedirectButton,
  passwordToggle,
} from "@/styles/theme";

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
    if (auth.user) router.push("/");
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

  return (
    <div className={pageWrapper}>
      <div className={cardContainer}>
        <div className={textCenter}>
          <h2 className={headingText}>
            SaaS AI App
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Login to your account to continue
          </p>
        </div>

        {errorMsg && <p className={formError}>{errorMsg}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <MdOutlineMailOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl" />
            <input
              type="email"
              placeholder="Enter your email"
              className={`${inputBase} pl-10`} // add left padding to make space for the icon
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className={formLabel}>Password</label>
            <div className="relative">
              {/* Icon */}
              <CiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xl" />

              {/* Input field */}
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className={`${inputBase} pl-10 pr-20`} // padding left for icon, right for button
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {/* Show/Hide toggle */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-sm text-blue-600 hover:underline focus:outline-none cursor-pointer"
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
              onClick={() => router.push("/forgot-password")}
              className={linkText}
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`${buttonPrimary} ${loading && "opacity-50 cursor-not-allowed"}`}
          >
            {loading ? "Logging in..." : "Sign In"}
          </button>
        </form>

        <div className={loginRedirectText}>
          <span>Don't have an account? </span>
          <button
            type="button"
            onClick={() => router.push("/register")}
            className={loginRedirectButton}
          >
            Create New Account
          </button>
        </div>
      </div>
    </div>
  );
}
