'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { api, AUTH_URL } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';

interface RegisterResponse {
  message: string;
  devVerificationUrl?: string;
}

export function SignupForm() {
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
        body: { name, email, password },
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
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#F2F3E9] text-2xl">
          ✉️
        </div>
        <h3 className="text-lg font-bold text-zinc-900">Check your inbox</h3>
        <p className="mt-2 text-sm text-zinc-600">
          We sent a verification link to <strong>{email}</strong>. Click it to
          activate your account, then log in.
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
      <TextField
        label="Full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="John Doe"
        autoComplete="name"
        minLength={2}
        required
      />
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        autoComplete="email"
        required
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Minimum 8 characters"
        autoComplete="new-password"
        minLength={8}
        hint="At least 8 characters."
        error={error}
        required
      />
      <Button type="submit" fullWidth loading={busy}>
        Create account
      </Button>
    </form>
  );
}
