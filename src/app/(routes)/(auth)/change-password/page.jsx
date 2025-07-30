"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  pageWrapper,
  cardContainer,
  inputBase,
  formLabel,
  passwordToggle,
  buttonPrimary,
  formSuccess,
  formError,
  headingText,
  subText,
} from "@/styles/theme"; // adjust the import path if needed

export default function ChangePasswordPage() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [statusMessage, setStatusMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => setStatusMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = formData;

    if (newPassword !== confirmPassword) {
      setStatusMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    try {
      setLoading(true);
      setStatusMessage(null);

      const res = await fetch("/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });

      const result = await res.json();

      if (res.ok) {
        setStatusMessage({ type: "success", text: result.message || "Password updated" });
        setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setTimeout(() => router.push("/"), 2000);
      } else {
        setStatusMessage({ type: "error", text: result.error || "Error changing password" });
      }
    } catch (error) {
      setStatusMessage({ type: "error", text: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={pageWrapper}>
      <div className={cardContainer}>
        <h2 className={`${headingText} text-center mb-2`}>Change Password</h2>
        <p className={subText}>Update your account password</p>

        <form className="space-y-5 mt-6" onSubmit={handleSubmit}>
          {/* Current Password */}
          <div>
            <label htmlFor="currentPassword" className={formLabel}>
              Current Password
            </label>
            <div className="relative">
              <input
                id="currentPassword"
                name="currentPassword"
                type={showPasswords.current ? "text" : "password"}
                required
                className={inputBase}
                value={formData.currentPassword}
                onChange={handleInputChange}
              />
              <button
                type="button"
                className={passwordToggle}
                onClick={() => togglePasswordVisibility("current")}
              >
                {showPasswords.current ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label htmlFor="newPassword" className={formLabel}>
              New Password
            </label>
            <div className="relative">
              <input
                id="newPassword"
                name="newPassword"
                type={showPasswords.new ? "text" : "password"}
                required
                className={inputBase}
                value={formData.newPassword}
                onChange={handleInputChange}
              />
              <button
                type="button"
                className={passwordToggle}
                onClick={() => togglePasswordVisibility("new")}
              >
                {showPasswords.new ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className={formLabel}>
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPasswords.confirm ? "text" : "password"}
                required
                className={inputBase}
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
              <button
                type="button"
                className={passwordToggle}
                onClick={() => togglePasswordVisibility("confirm")}
              >
                {showPasswords.confirm ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div className={statusMessage.type === "error" ? formError : formSuccess}>
              {statusMessage.text}
            </div>
          )}

          {/* Submit */}
          <button type="submit" disabled={loading} className={buttonPrimary}>
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
