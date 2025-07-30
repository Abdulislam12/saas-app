'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  buttonPrimary,
  inputBase,
  cardContainer,
  headingText,
  textCenter,
  iconWrapper,
  pageWrapper,
  errorText,
  successText,
  subText,
} from '@/styles/theme';

export default function ResetPasswordConfirm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setError('Invalid or missing token');
      return;
    }

    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/confirm-password?token=${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(data.message || 'Password reset successful!');
        setPassword('');
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={pageWrapper}>
      <form onSubmit={handleSubmit} className={cardContainer}>
        {/* Icon + Heading */}
        <div className={`${textCenter} flex flex-col items-center`}>
          <div className={`${iconWrapper} bg-blue-100 text-blue-600 mb-3`}>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 11c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 6v12h16V6M4 6l8 6 8-6"
              />
            </svg>
          </div>
          <h2 className={headingText}>Reset Your Password</h2>
          <p className={subText}>Enter your new password below.</p>
        </div>

        {/* Status Messages */}
        {error && <p className={errorText}>{error}</p>}
        {success && <p className={successText}>{success}</p>}

        {/* Input Field */}
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={`${inputBase} mb-4`}
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`${buttonPrimary} ${loading ? 'bg-blue-400 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Resetting Password...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
}
