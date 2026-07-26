'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { api, AUTH_URL } from '@/lib/api';
import { AuthShell } from '@/components/auth/auth-shell';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError('Password reset token is missing from the URL.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setBusy(true);
    try {
      await api(AUTH_URL, '/auth/password/reset/confirm', {
        method: 'POST',
        body: { token, password },
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="mb-4 text-center">
        {/* key / lock cover circle icon */}
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#F2F3E9] text-[#335438]">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold">Reset password</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Enter a strong, secure new password for your account
        </p>
      </div>

      {success ? (
        <div className="space-y-4 text-center">
          <div className="rounded-xl bg-green-50 border border-green-200 p-4 text-sm text-green-800">
            Password reset successful! You can now log in using your new password.
          </div>
          <Link href="/login">
            <Button fullWidth>
              Go to Sign In
            </Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleReset} className="space-y-4">
          {!token && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-800">
              Invalid Link: Token is missing from the URL. Please request a new link.
            </div>
          )}
          <TextField
            label="New password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoFocus
          />
          <TextField
            label="Confirm new password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            error={error}
            required
          />
          <Button type="submit" fullWidth loading={busy} disabled={!token}>
            Reset Password
          </Button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthShell>
      <Suspense fallback={
        <div className="flex justify-center items-center py-10">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" />
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
