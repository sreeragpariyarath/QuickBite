'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, ChevronRight, LayoutDashboard } from 'lucide-react';
import { api, AUTH_URL } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';
import { AuthShell } from '@/components/auth/auth-shell';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginWithTokens, logout } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);

    try {
      // 1. Submit email login request
      const res = await api<LoginResponse>(AUTH_URL, '/auth/login/email', {
        method: 'POST',
        body: { email, password },
      });

      // 2. Fetch authenticated profile
      const userProfile = await loginWithTokens(res.accessToken, res.refreshToken);

      // 3. Enforce OWNER role checks
      if (userProfile?.role === 'OWNER') {
        router.push('/admin');
      } else {
        // Clear session if not authorized
        logout();
        setError('Access denied. This login portal is reserved for Restaurant Partners/Owners.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid email or password');
      logout(); // Clean state
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell>
      <div className="mb-6 text-center mt-6 lg:mt-0">
        {/* Dashboard Icon Header */}
        <div className="mx-auto mb-3 hidden lg:flex h-12 w-12 items-center justify-center rounded-full bg-[#F2F3E9] text-[#335438]">
          <LayoutDashboard className="h-6 w-6 stroke-[2]" />
        </div>
        <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Partner Portal</h2>
        <p className="mt-2 text-sm text-zinc-500 max-w-[280px] mx-auto leading-relaxed">
          Sign in to manage your restaurants, update menus, and track incoming orders.
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        <TextField
          label="Partner Email"
          type="email"
          icon={<Mail className="h-5 w-5 text-zinc-400" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="partner@quickbite.com"
          autoComplete="email"
          required
        />
        <TextField
          label="Password"
          type="password"
          icon={<Lock className="h-5 w-5 text-zinc-400" />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
          error={error}
          required
        />

        <Button type="submit" className="relative font-bold mt-2" fullWidth loading={busy}>
          <span>Sign in to Dashboard</span>
          <span className="absolute right-4 top-1/2 -translate-y-1/2">
            <ChevronRight className="h-4 w-4 stroke-[3]" />
          </span>
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-zinc-400 leading-normal border-t border-zinc-100 pt-4">
        Need a partner account? Sign up on the main portal or contact admin support.
      </p>
    </AuthShell>
  );
}
