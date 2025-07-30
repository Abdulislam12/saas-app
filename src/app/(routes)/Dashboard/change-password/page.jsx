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
} from "@/styles/theme";

import { Eye, EyeOff } from "lucide-react";

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

  const renderInput = (field, label) => (
    <div>
      <label htmlFor={field} className={formLabel}>
        {label}
      </label>
      <div className="relative">
        <input
          id={field}
          name={field}
          type={showPasswords[field] ? "text" : "password"}
          required
          className={inputBase}
          value={formData[field]}
          onChange={handleInputChange}
        />
        <button
          type="button"
          className={`${passwordToggle} cursor-pointer`}
          onClick={() => togglePasswordVisibility(field)}
          aria-label={`Toggle ${field}`}
        >
          {showPasswords[field] ? (
            <EyeOff className="h-5 w-5 text-gray-500" />
          ) : (
            <Eye className="h-5 w-5 text-gray-500" />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className={`${pageWrapper} px-4 sm:px-6 lg:px-8`}>
      <div className={cardContainer}>
        <h2 className={`${headingText} text-center mb-2`}>Change Password</h2>
        <p className={subText}>Update your account password</p>

        <form className="space-y-5 mt-6" onSubmit={handleSubmit}>
          {renderInput("currentPassword", "Current Password")}
          {renderInput("newPassword", "New Password")}
          {renderInput("confirmPassword", "Confirm New Password")}

          {statusMessage && (
            <div className={statusMessage.type === "error" ? formError : formSuccess}>
              {statusMessage.text}
            </div>
          )}

          <button type="submit" disabled={loading} className={buttonPrimary}>
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
