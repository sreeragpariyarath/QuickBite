"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ConfirmationResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { ChevronRight, ShieldCheck } from "lucide-react";
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
  const [cooldown, setCooldown] = useState(45);

  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  const fullPhone = `+91 ${phone.replace(/\D/g, "")}`;

  useEffect(() => {
    if (stage !== "otp" || cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((c) => c - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [stage, cooldown]);

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
    if (e) e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const verifier = getRecaptchaVerifier();
      const sanitizedPhone = `+91${phone.replace(/\D/g, "")}`;
      const confirmation = await signInWithPhoneNumber(
        auth,
        sanitizedPhone,
        verifier,
      );
      setConfirmationResult(confirmation);
      setCooldown(45);
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
            className="space-y-5"
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
            <Button type="submit" className="relative font-bold animate-fade-in" fullWidth loading={busy}>
              <span>Send verification code</span>
              <span className="absolute right-4 top-1/2 -translate-y-1/2">
                <ChevronRight className="h-4 w-4 stroke-[3]" />
              </span>
            </Button>
          </motion.form>
        ) : (
          <motion.form
            key="otp"
            {...step}
            transition={{ duration: 0.2 }}
            onSubmit={verifyOtp}
            className="space-y-5"
          >
            <div className="space-y-2">
              <div className="mb-4 text-center">
                <h2 className="text-2xl font-bold">Enter OTP</h2>
                <p className="mt-1 text-sm text-zinc-500">
                  We&apos;ve sent a 6-digit code to{" "}
                  <span className="font-semibold text-zinc-850">{fullPhone}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setStage("phone");
                      setOtp("");
                      setError(null);
                    }}
                    className="font-bold text-[#335438] hover:underline ml-1.5 cursor-pointer"
                  >
                    Change
                  </button>
                </p>
              </div>
              
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

              <div className="text-center text-xs text-zinc-500 pt-2">
                Didn&apos;t receive the code?{" "}
                {cooldown > 0 ? (
                  <span>
                    Resend OTP in 00:{cooldown < 10 ? `0${cooldown}` : cooldown}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => requestOtp(e)}
                    className="font-bold text-[#335438] hover:underline cursor-pointer"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
              
              {error && <p className="text-xs text-red-600 text-center pt-1">{error}</p>}
            </div>

            <Button type="submit" className="relative font-bold mt-4" fullWidth loading={busy}>
              <span>Verify OTP</span>
              <span className="absolute right-4 top-1/2 -translate-y-1/2">
                <ChevronRight className="h-4 w-4 stroke-[3]" />
              </span>
            </Button>

            <div className="flex items-center justify-center gap-2 rounded-xl bg-[#F2F3E9] p-3 text-[11px] text-[#335438] mt-6 select-none border border-[#335438]/5">
              <ShieldCheck className="h-4 w-4 shrink-0 text-[#335438]" />
              <span>Your data is safe and secure. We never share your information.</span>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
