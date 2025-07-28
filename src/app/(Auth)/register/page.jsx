"use client";

import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

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
    if (auth.user) {
      router.push("/");
    }
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
        setTimeout(() => {
          router.push("/login");
        }, 1500);
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

  const handleLoginRedirect = () => {
    router.push("/login");
  };

  return (
    <>
      <Head>
        <title>Register | Rustam Finance System</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-md">
          <h1 className="text-2xl font-bold text-center text-gray-800">
            Rustam Industry Finance<br />Management System
          </h1>
          <p className="text-sm text-gray-500 text-center mt-1 mb-6">
            Create your admin account to get started
          </p>

          {errorMsg && (
            <div className="text-sm text-red-600 bg-red-100 px-3 py-2 rounded mb-4 text-center">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="text-sm text-green-700 bg-green-100 px-3 py-2 rounded mb-4 text-center">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-24"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 text-sm text-blue-600 hover:underline focus:outline-none"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>


            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition duration-200"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <div className="text-center mt-4 text-sm text-gray-600">
            Already have an account?{" "}
            <button
              type="button"
              onClick={handleLoginRedirect}
              className="text-blue-600 hover:underline focus:outline-none"
            >
              Log in
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
