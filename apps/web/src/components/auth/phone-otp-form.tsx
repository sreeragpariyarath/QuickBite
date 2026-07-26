"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ConfirmationResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { api, AUTH_URL } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";

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

  const [stage, setStage] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  const fullPhone = `+91${phone.replace(/\D/g, "")}`;

  const getRecaptchaVerifier = () => {
    if (recaptchaVerifierRef.current) {
      return recaptchaVerifierRef.current;
    }
    const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
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
      const confirmation = await signInWithPhoneNumber(
        auth,
        fullPhone,
        verifier,
      );
      setConfirmationResult(confirmation);
      setStage("otp");
    } catch (e: any) {
      setError(e instanceof Error ? e.message : "Something went wrong");
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
      setError("No verification session found. Please request OTP again.");
      setStage("phone");
      setBusy(false);
      return;
    }
    try {
      const userCredential = await confirmationResult.confirm(otp);
      const idToken = await userCredential.user.getIdToken();

      const res = await api<OtpVerifyResponse>(AUTH_URL, "/auth/otp/verify", {
        method: "POST",
        body: { firebaseToken: idToken, role: "CUSTOMER" },
      });
      await loginWithTokens(res.accessToken, res.refreshToken);
      router.push(res.isNewUser ? "/welcome" : "/");
    } catch (e: any) {
      setError(e instanceof Error ? e.message : "Invalid code. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative">
      <div id="recaptcha-container"></div>
      <AnimatePresence mode="wait" initial={false}>
        {stage === "phone" ? (
          <motion.form
            key="phone"
            {...step}
            transition={{ duration: 0.2 }}
            onSubmit={requestOtp}
            className="space-y-3"
          >
            <TextField
              label="Phone number"
              prefix={
                <div className="flex items-center gap-1 select-none">
                  <span>+91</span>
                  <svg className="h-3 w-3 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              }
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your mobile number"
              inputMode="numeric"
              autoComplete="tel-national"
              hint="We'll send you a 6-digit verification code via SMS."
              error={error}
              autoFocus
              required
            />
            <Button type="submit" fullWidth loading={busy}>
              <span>Send verification code</span>
              <svg className="h-4 w-4 -rotate-12 transform fill-current" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </Button>
          </motion.form>
        ) : (
          <motion.form
            key="otp"
            {...step}
            transition={{ duration: 0.2 }}
            onSubmit={verifyOtp}
            className="space-y-3"
          >
            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-700 text-center">
                Enter the 6-digit code sent to {fullPhone}
              </label>
              
              <div className="relative flex justify-center py-2">
                {/* Hidden input overlaying the boxes to capture typing/paste */}
                <input
                  type="text"
                  pattern="\d*"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    if (val.length <= 6) {
                      setOtp(val);
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-text z-10"
                  autoFocus
                  required
                />
                
                {/* Styled premium boxes */}
                <div className="flex gap-2">
                  {Array.from({ length: 6 }).map((_, i) => {
                    const char = otp[i] || "";
                    const isFocused = i === otp.length || (i === 5 && otp.length === 6);
                    return (
                      <div
                        key={i}
                        className={`w-11 h-14 rounded-xl border flex items-center justify-center text-lg font-bold font-mono transition-all ${
                          isFocused
                            ? "border-[#335438] ring-2 ring-[#335438]/20 bg-white shadow-sm"
                            : "border-zinc-200 bg-zinc-50 text-zinc-800"
                        }`}
                      >
                        {char ? (
                          <span className="scale-100 transition-transform duration-100">{char}</span>
                        ) : (
                          <span className="text-zinc-300 text-xs">•</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {error && <p className="text-xs text-red-600 text-center">{error}</p>}
            </div>

            <Button type="submit" fullWidth loading={busy}>
              Verify & Sign In
            </Button>
            <Button
              type="button"
              variant="ghost"
              fullWidth
              onClick={() => {
                setStage("phone");
                setOtp("");
                setError(null);
                if (recaptchaVerifierRef.current) {
                  recaptchaVerifierRef.current.clear();
                  recaptchaVerifierRef.current = null;
                }
              }}
            >
              ← Edit phone number
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
