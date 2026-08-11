'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { api, AUTH_URL } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { AuthShell } from '@/components/auth/auth-shell';
import { PhoneOtpForm } from '@/components/auth/phone-otp-form';
import { EmailLoginForm } from '@/components/auth/email-login-form';
import { Tabs } from '@/components/ui/tabs';

const TABS = [
  { id: 'phone', label: 'Continue with phone' },
  { id: 'email', label: 'Continue with email' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function LoginPage() {
  const router = useRouter();
  const { loginWithTokens } = useAuth();
  const [tab, setTab] = useState<TabId>('phone');
  const [googleBusy, setGoogleBusy] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);

  async function handleGoogleSignIn() {
    setGoogleBusy(true);
    setGoogleError(null);
    try {
      const provider = new GoogleAuthProvider();
      const credential = await signInWithPopup(auth, provider);
      const token = await credential.user.getIdToken();
      
      const res = await api<any>(AUTH_URL, '/auth/otp/verify', {
        method: 'POST',
        body: { firebaseToken: token, role: 'CUSTOMER' },
      });
      
      await loginWithTokens(res.accessToken, res.refreshToken);
      router.push(res.isNewUser ? '/welcome' : '/');
    } catch (err: any) {
      console.error(err);
      setGoogleError(err instanceof Error ? err.message : 'Google authentication failed');
    } finally {
      setGoogleBusy(false);
    }
  }

  return (
    <AuthShell>
      <div className="mb-6 text-center mt-6 lg:mt-0">
        {/* chef hat / dish cover circle icon - hidden on mobile, visible on desktop */}
        <div className="mx-auto mb-3 hidden lg:flex h-12 w-12 items-center justify-center rounded-full bg-[#F2F3E9] text-[#335438]">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Welcome back!</h2>
        <p className="mt-2 text-sm text-zinc-500 max-w-[280px] mx-auto leading-relaxed">
          Sign in to continue to your account and enjoy your favorite meals.
        </p>
      </div>

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === 'phone' ? <PhoneOtpForm /> : <EmailLoginForm />}

      {googleError && (
        <p className="mt-2 text-center text-xs text-red-600">{googleError}</p>
      )}

      <div className="relative my-4 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-100"></div>
        </div>
        <span className="relative bg-white px-3 text-xs text-zinc-400 font-medium">or</span>
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={googleBusy}
        className="w-full flex items-center justify-center gap-2.5 rounded-xl border border-zinc-200 bg-white py-3 text-sm font-bold text-zinc-700 shadow-sm transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 disabled:opacity-50 cursor-pointer"
      >
        {googleBusy ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" />
        ) : (
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        )}
        Continue with Google
      </button>

      <p className="mt-4 text-center text-sm text-zinc-500">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="font-semibold text-[#335438] hover:underline">
          Sign up
        </Link>
      </p>

      <p className="mt-2 text-center text-xs text-zinc-500">
        Restaurant Owner / Partner?{' '}
        <Link href="/admin/login" className="font-bold text-[#335438] hover:underline cursor-pointer">
          Sign in to Partner Portal →
        </Link>
      </p>

      <p className="mt-3.5 border-t border-zinc-100 pt-3 text-center text-xs text-zinc-400">
        By proceeding, you agree to our Terms of Service and Privacy Policy.
      </p>
    </AuthShell>
  );
}
