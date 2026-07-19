'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, AUTH_URL } from '@/lib/api';
import { useAuth } from '@/lib/auth';

export default function WelcomePage() {
  const router = useRouter();
  const { refreshProfile } = useAuth();
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await api(AUTH_URL, '/auth/me', {
        method: 'PATCH',
        body: { name },
        auth: true,
      });
      await refreshProfile();
      router.push('/');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-12 bg-white rounded-lg border border-zinc-200 p-6">
      <h1 className="text-xl font-bold mb-1">Welcome to QuickBite! 🎉</h1>
      <p className="text-sm text-zinc-500 mb-6">What should we call you?</p>
      <form onSubmit={save} className="space-y-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          minLength={2}
          required
          className="w-full border border-zinc-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
          autoFocus
        />
        <button
          disabled={busy}
          className="w-full bg-red-600 text-white rounded-md py-2 font-medium hover:bg-red-700 disabled:opacity-50"
        >
          {busy ? 'Saving…' : 'Continue'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/')}
          className="w-full text-sm text-zinc-500 hover:text-zinc-700"
        >
          Skip for now
        </button>
      </form>
      {error && <p className="text-sm text-red-600 mt-4">{error}</p>}
    </div>
  );
}
