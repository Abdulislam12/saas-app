'use client';

import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  forgotPasswordWrapper,
  forgotPasswordCard,
  forgotPasswordIconWrapper,
  forgotPasswordButton,
  forgotPasswordTitle,
  forgotPasswordText,
  backLink,
  inputBase,
  formError,
  formSuccess,
} from '@/styles/theme';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/forget-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.status === 200) {
        setMessage('✅ Reset link sent to your email');
        setEmail('');
      } else {
        setError(data.message || '❌ Something went wrong');
      }
    } catch {
      setError('❌ Server error. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage('');
        setError('');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  return (
    <>
      <Head>
        <title>SaaS AI Agent App - Forgot Password</title>
      </Head>

      <div className={forgotPasswordWrapper}>
        <div className={forgotPasswordCard}>
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className={forgotPasswordIconWrapper}>
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 12H8m0 0l4-4m-4 4l4 4m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          {/* Title and Description */}
          <h2 className={forgotPasswordTitle}>Forgot Your Password?</h2>
          <p className={forgotPasswordText}>Enter your email and we'll send you a reset link.</p>

          {/* Feedback Messages */}
          {message && <p className={formSuccess}>{message}</p>}
          {error && <p className={formError}>{error}</p>}

          {/* Form */}
          <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputBase}
            />
            <button
              type="submit"
              className={`${forgotPasswordButton} ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Password Reset Link'}
            </button>
          </form>

          {/* Back Button instead of Link */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => router.push('/login')}
              className={backLink}
            >
              ← Back to Log In
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
