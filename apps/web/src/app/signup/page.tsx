'use client';

import Link from 'next/link';
import { AuthShell } from '@/components/auth/auth-shell';
import { SignupForm } from '@/components/auth/signup-form';

export default function SignupPage() {
  return (
    <AuthShell>
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold">Create your account</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Sign up with email — we&apos;ll send you a verification link
        </p>
      </div>

      <SignupForm />

      <p className="mt-6 text-center text-sm text-zinc-500">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-teal-600 hover:underline">
          Login
        </Link>
      </p>
      <p className="mt-2 text-center text-xs text-zinc-400">
        Prefer your phone? OTP login on the{' '}
        <Link href="/login" className="underline">
          login page
        </Link>{' '}
        signs you up automatically.
      </p>
    </AuthShell>
  );
}
