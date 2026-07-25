'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { api, AUTH_URL } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';

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
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  const fullPhone = `+91${phone.replace(/\D/g, '')}`;

  const getRecaptchaVerifier = () => {
    if (recaptchaVerifierRef.current) {
      return recaptchaVerifierRef.current;
    }
    const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
    });
    recaptchaVerifierRef.current = verifier;
    return verifier;
  };

  async function requestOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const verifier = getRecaptchaVerifier();
      const confirmation = await signInWithPhoneNumber(auth, fullPhone, verifier);
      setConfirmationResult(confirmation);
      setStage('otp');
    } catch (e: any) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = null;
      }
    } finally {
      setBusy(false);
    }
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    if (!confirmationResult) {
      setError('No verification session found. Please request OTP again.');
      setStage('phone');
      setBusy(false);
      return;
    }
    try {
      const userCredential = await confirmationResult.confirm(otp);
      const idToken = await userCredential.user.getIdToken();

      const res = await api<OtpVerifyResponse>(AUTH_URL, '/auth/otp/verify', {
        method: 'POST',
        body: { firebaseToken: idToken, role: 'CUSTOMER' },
      });
      await loginWithTokens(res.accessToken, res.refreshToken);
      router.push(res.isNewUser ? '/welcome' : '/');
    } catch (e: any) {
      setError(e instanceof Error ? e.message : 'Invalid code. Try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative">
      <div id="recaptcha-container"></div>
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
              hint="We'll send you a 6-digit OTP to verify your number via Firebase."
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
                setError(null);
                if (recaptchaVerifierRef.current) {
                  recaptchaVerifierRef.current.clear();
                  recaptchaVerifierRef.current = null;
                }
              }}
            >
              ← Change number
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
