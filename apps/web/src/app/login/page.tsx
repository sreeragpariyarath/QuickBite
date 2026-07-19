'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, AUTH_URL } from '@/lib/api';
import { useAuth } from '@/lib/auth';

interface OtpRequestResponse {
  message: string;
  expiresInSeconds: number;
  devOtp?: string;
}

interface OtpVerifyResponse {
  accessToken: string;
  refreshToken: string;
  isNewUser: boolean;
}

export default function LoginPage() {
  const router = useRouter();
  const { loginWithTokens } = useAuth();

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('+91');
  const [otp, setOtp] = useState('');
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function requestOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await api<OtpRequestResponse>(AUTH_URL, '/auth/otp/request', {
        method: 'POST',
        body: { phone },
      });
      if (res.devOtp) {
        setOtp(res.devOtp);
        setDevOtp(res.devOtp);
      }
      setStep('otp');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setBusy(false);
    }
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await api<OtpVerifyResponse>(AUTH_URL, '/auth/otp/verify', {
        method: 'POST',
        body: { phone, otp, role: 'CUSTOMER' },
      });
      await loginWithTokens(res.accessToken, res.refreshToken);
      router.push(res.isNewUser ? '/welcome' : '/');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-12 bg-white rounded-lg border border-zinc-200 p-6">
      <h1 className="text-xl font-bold mb-1">Login to QuickBite</h1>
      <p className="text-sm text-zinc-500 mb-6">
        We&apos;ll send a one-time password to your phone.
      </p>

      {step === 'phone' ? (
        <form onSubmit={requestOtp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Phone number
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+919876543210"
              className="w-full border border-zinc-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              autoFocus
            />
          </div>
          <button
            disabled={busy}
            className="w-full bg-red-600 text-white rounded-md py-2 font-medium hover:bg-red-700 disabled:opacity-50"
          >
            {busy ? 'Sending…' : 'Send OTP'}
          </button>
        </form>
      ) : (
        <form onSubmit={verifyOtp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              OTP sent to {phone}
            </label>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="6-digit code"
              maxLength={6}
              className="w-full border border-zinc-300 rounded-md px-3 py-2 tracking-widest text-center text-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              autoFocus
            />
            {devOtp && (
              <p className="text-xs text-amber-600 mt-1">
                Dev mode: OTP {devOtp} was pre-filled for you.
              </p>
            )}
          </div>
          <button
            disabled={busy}
            className="w-full bg-red-600 text-white rounded-md py-2 font-medium hover:bg-red-700 disabled:opacity-50"
          >
            {busy ? 'Verifying…' : 'Verify & login'}
          </button>
          <button
            type="button"
            onClick={() => {
              setStep('phone');
              setOtp('');
              setDevOtp(null);
            }}
            className="w-full text-sm text-zinc-500 hover:text-zinc-700"
          >
            Change number
          </button>
        </form>
      )}

      {error && <p className="text-sm text-red-600 mt-4">{error}</p>}
    </div>
  );
}
