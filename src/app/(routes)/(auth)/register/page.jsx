"use client";

import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { MdOutlineMailOutline } from "react-icons/md";
import { CiLock } from "react-icons/ci";
import {
  pageWrapper,
  textCenter,
  headingText,
  formHint,
  formBox,
  formLabel,
  inputBase,
  passwordToggle,
  buttonPrimary,
  formError,
  formSuccess,
  loginRedirectText,
  loginRedirectButton,
} from "@/styles/theme"; // adjust import path if needed

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    if (auth.user) router.push("/");
  }, [auth.user]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.status === 201) {
        setSuccessMsg("Registration successful! Redirecting...");
        setEmail("");
        setPassword("");
        setTimeout(() => router.push("/login"), 1500);
      } else {
        setErrorMsg(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error registering:", error);
      setErrorMsg("Failed to register.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Register | SaaS AI APP</title>
      </Head>

      <div className={pageWrapper}>
        <div className={formBox}>
          <div className={textCenter}>
            <h1 className={headingText}>SaaS AI APP</h1>
            <p className={formHint}>Create your account below</p>
          </div>

          {errorMsg && <div className={formError}>{errorMsg}</div>}
          {successMsg && <div className={formSuccess}>{successMsg}</div>}

          <form onSubmit={handleRegister} className="space-y-4 mt-4">
            {/* EMAIL FIELD WITH ICON */}
            <div>
              <label className={formLabel}>Email Address</label>
              <div className="relative">
                <MdOutlineMailOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl pointer-events-none" />
                <input
                  type="email"
                  className={`${inputBase} pl-10`}
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* PASSWORD FIELD WITH ICON + TOGGLE */}
            <div>
              <label className={formLabel}>Password</label>
              <div className="relative">
                <CiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-xl pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  className={`${inputBase} pl-10 pr-20`}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-600 hover:underline focus:outline-none cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className={`${buttonPrimary} ${loading && "opacity-50 cursor-not-allowed"}`}
            >
              {loading ? "Registering..." : "Sign Up"}
            </button>
          </form>


          <div className={loginRedirectText}>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/login")}
              className={loginRedirectButton}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
