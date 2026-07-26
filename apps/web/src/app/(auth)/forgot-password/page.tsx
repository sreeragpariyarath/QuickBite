'use client';

import { useState } from 'react';
import Link from 'next/link';
import { api, AUTH_URL } from '@/lib/api';
import { AuthShell } from '@/components/auth/auth-shell';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleRequest(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await api(AUTH_URL, '/auth/password/reset/request', {
        method: 'POST',
        body: { email },
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell>
      <div className="mb-4 text-center">
        {/* key / lock cover circle icon */}
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#F2F3E9] text-[#335438]">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m-2-2a2 2 0 00-2-2m2 2a2 2 0 002 2m0 0V19a2 2 0 01-2 2h-6a2 2 0 01-2-2V9a2 2 0 012-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v2m-6 4h6m-6 4h6" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold">Forgot password</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Enter your email to receive a secure password reset link
        </p>
      </div>

      {success ? (
        <div className="space-y-4 text-center">
          <div className="rounded-xl bg-green-50 border border-green-200 p-4 text-sm text-green-800">
            Check your email inbox. We have sent a secure link to reset your password.
          </div>
          <Link href="/login">
            <Button variant="secondary" fullWidth>
              Back to Sign In
            </Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleRequest} className="space-y-4">
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            error={error}
            required
            autoFocus
          />
          <Button type="submit" fullWidth loading={busy}>
            Send Reset Link
          </Button>
          <div className="text-center">
            <Link href="/login" className="text-sm font-semibold text-[#335438] hover:underline">
              ← Back to Sign In
            </Link>
          </div>
        </form>
      )}
    </AuthShell>
  );
}
