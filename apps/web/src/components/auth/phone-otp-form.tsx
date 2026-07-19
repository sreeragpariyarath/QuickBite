'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { api, AUTH_URL } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';

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

const step = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
};

export function PhoneOtpForm() {
  const router = useRouter();
  const { loginWithTokens } = useAuth();

  const [stage, setStage] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const fullPhone = `+91${phone.replace(/\D/g, '')}`;

  async function requestOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await api<OtpRequestResponse>(AUTH_URL, '/auth/otp/request', {
        method: 'POST',
        body: { phone: fullPhone },
      });
      if (res.devOtp) {
        setOtp(res.devOtp);
        setDevOtp(res.devOtp);
      }
      setStage('otp');
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
        body: { phone: fullPhone, otp, role: 'CUSTOMER' },
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
    <AnimatePresence mode="wait" initial={false}>
      {stage === 'phone' ? (
        <motion.form
          key="phone"
          {...step}
          transition={{ duration: 0.2 }}
          onSubmit={requestOtp}
          className="space-y-4"
        >
          <TextField
            label="Mobile number"
            prefix="🇮🇳 +91"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="98765 43210"
            inputMode="numeric"
            autoComplete="tel-national"
            hint="We'll send you a 6-digit OTP to verify your number."
            error={error}
            autoFocus
            required
          />
          <Button type="submit" fullWidth loading={busy}>
            Send OTP →
          </Button>
        </motion.form>
      ) : (
        <motion.form
          key="otp"
          {...step}
          transition={{ duration: 0.2 }}
          onSubmit={verifyOtp}
          className="space-y-4"
        >
          <TextField
            label={`OTP sent to ${fullPhone}`}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="••••••"
            maxLength={6}
            inputMode="numeric"
            autoComplete="one-time-code"
            className="text-center text-lg tracking-[0.5em]"
            hint={devOtp ? `Dev mode: OTP ${devOtp} pre-filled for you.` : undefined}
            error={error}
            autoFocus
            required
          />
          <Button type="submit" fullWidth loading={busy}>
            Verify & continue
          </Button>
          <Button
            type="button"
            variant="ghost"
            fullWidth
            onClick={() => {
              setStage('phone');
              setOtp('');
              setDevOtp(null);
              setError(null);
            }}
          >
            ← Change number
          </Button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
