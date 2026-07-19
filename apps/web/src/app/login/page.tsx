'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AuthShell } from '@/components/auth/auth-shell';
import { PhoneOtpForm } from '@/components/auth/phone-otp-form';
import { EmailLoginForm } from '@/components/auth/email-login-form';
import { Tabs } from '@/components/ui/tabs';

const TABS = [
  { id: 'phone', label: '📱 Mobile OTP' },
  { id: 'email', label: '✉️ Email' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function LoginPage() {
  const [tab, setTab] = useState<TabId>('phone');

  return (
    <AuthShell>
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold">
          Welcome to Quick<span className="text-teal-600">Bite</span>
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Login or sign up in seconds
        </p>
      </div>

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === 'phone' ? <PhoneOtpForm /> : <EmailLoginForm />}

      <p className="mt-6 text-center text-sm text-zinc-500">
        New here with email?{' '}
        <Link href="/signup" className="font-semibold text-teal-600 hover:underline">
          Create an account
        </Link>
      </p>
      <p className="mt-4 border-t border-zinc-100 pt-4 text-center text-xs text-zinc-400">
        By continuing you agree to our Terms of Service and Privacy Policy.
      </p>
    </AuthShell>
  );
}
