"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, ChevronRight } from "lucide-react";
import { api, AUTH_URL } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export function EmailLoginForm() {
  const router = useRouter();
  const { loginWithTokens } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resent, setResent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNeedsVerification(false);
    setBusy(true);
    try {
      const res = await api<LoginResponse>(AUTH_URL, "/auth/login/email", {
        method: "POST",
        body: { email, password },
      });
      await loginWithTokens(res.accessToken, res.refreshToken);
      router.push("/");
    } catch (e) {
      const message = e instanceof Error ? e.message : "Something went wrong";
      if (message.toLowerCase().includes("verify")) {
        setNeedsVerification(true);
      }
      setError(message);
    } finally {
      setBusy(false);
    }
  }

  async function resend() {
    setBusy(true);
    try {
      await api(AUTH_URL, "/auth/email/resend", {
        method: "POST",
        body: { email },
      });
      setResent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not resend");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={login} className="space-y-4">
      <TextField
        label="Email address"
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
        autoComplete="current-password"
        error={error}
        required
      />
      <div className="flex justify-end pt-1">
        <Link
          href="/forgot-password"
          className="text-xs font-semibold text-[#335438] hover:underline cursor-pointer"
        >
          Forgot password?
        </Link>
      </div>
      {needsVerification && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
          {resent ? (
            "Verification email sent — check your inbox."
          ) : (
            <>
              Your email isn&apos;t verified yet.{" "}
              <button
                type="button"
                onClick={resend}
                className="font-semibold underline"
              >
                Resend verification email
              </button>
            </>
          )}
        </div>
      )}
      <Button type="submit" className="relative font-bold" fullWidth loading={busy}>
        <span>Sign in</span>
        <span className="absolute right-4 top-1/2 -translate-y-1/2">
          <ChevronRight className="h-4 w-4 stroke-[3]" />
        </span>
      </Button>
    </form>
  );
}
