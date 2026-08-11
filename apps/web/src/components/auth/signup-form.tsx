'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ChevronRight } from 'lucide-react';
import { api, AUTH_URL } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';

interface RegisterResponse {
  message: string;
  devVerificationUrl?: string;
}

export function SignupForm() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role') === 'OWNER' ? 'OWNER' : 'CUSTOMER';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<RegisterResponse | null>(null);

  async function signup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await api<RegisterResponse>(AUTH_URL, '/auth/register/email', {
        method: 'POST',
        body: { name, email, password, role },
      });
      setDone(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-4"
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#F2F3E9] text-[#335438]">
          <Mail className="h-6 w-6 stroke-[2.5]" />
        </div>
        <h3 className="text-lg font-bold text-zinc-900">Check your inbox</h3>
        <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
          We sent a verification link to <strong>{email}</strong>. Click it to
          activate your {role === 'OWNER' ? 'Partner' : 'Customer'} account, then log in.
        </p>
        {done.devVerificationUrl && (
          <a
            href={done.devVerificationUrl}
            className="mt-4 inline-block text-xs font-semibold text-[#335438] underline"
          >
            Dev mode: verify instantly →
          </a>
        )}
      </motion.div>
    );
  }

  return (
    <form onSubmit={signup} className="space-y-4">
      {role === 'OWNER' && (
        <div className="bg-[#F2F3E9]/80 border border-[#335438]/20 rounded-xl px-3.5 py-2 text-center text-xs text-[#335438] font-semibold">
          Registering as Restaurant Partner Account
        </div>
      )}

      <TextField
        label="Full name"
        icon={<User className="h-5 w-5 text-zinc-400" />}
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your full name"
        autoComplete="name"
        minLength={2}
        required
      />
      <TextField
        label="Email"
        type="email"
        icon={<Mail className="h-5 w-5 text-zinc-400" />}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email address"
        autoComplete="email"
        required
      />
      <TextField
        label="Password"
        type="password"
        icon={<Lock className="h-5 w-5 text-zinc-400" />}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        autoComplete="new-password"
        minLength={8}
        hint="At least 8 characters."
        error={error}
        required
      />
      <Button type="submit" className="relative font-bold mt-2" fullWidth loading={busy}>
        <span>Create {role === 'OWNER' ? 'Partner' : 'Customer'} account</span>
        <span className="absolute right-4 top-1/2 -translate-y-1/2">
          <ChevronRight className="h-4 w-4 stroke-[3]" />
        </span>
      </Button>
    </form>
  );
}
