'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { AUTH_SERVICE_URL, setAuthToken } from '@/lib/api';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@quickbite.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${AUTH_SERVICE_URL}/auth/login/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      if (data.accessToken) {
        setAuthToken(data.accessToken);
        if (data.user) {
          localStorage.setItem('qb_admin_user', JSON.stringify(data.user));
        }
        router.push('/dashboard');
      } else {
        throw new Error('No access token received from server');
      }
    } catch (err: any) {
      setError(err.message || 'Connection to auth-service failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#03060a] flex items-center justify-center p-4 relative overflow-hidden select-none font-sans">
      
      {/* Background Accent Blue/Violet Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/[0.03] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-[450px] h-[450px] bg-blue-800/[0.02] rounded-full blur-[90px] pointer-events-none" />

      {/* Card Wrapper with Outer Glow */}
      <div className="w-full max-w-[500px] relative group">
        
        {/* Left-side cyan border glow overlay (Outer highlight) */}
        <div className="absolute -inset-[1px] rounded-[36px] bg-gradient-to-r from-blue-500/35 via-blue-500/5 to-transparent blur-[2px] opacity-90 pointer-events-none z-0" />
        
        {/* Main Card Container */}
        <div className="w-full bg-[#0b0e15]/95 backdrop-blur-2xl border border-white/[0.03] rounded-[36px] p-8 sm:p-11 shadow-2xl relative z-10 overflow-hidden">
          
          {/* Inner border light accents */}
          <div className="absolute left-0 top-0 bottom-0 w-[1.5px] bg-gradient-to-b from-blue-400/50 via-blue-500/10 to-transparent pointer-events-none z-20" />
          <div className="absolute left-0 right-0 top-0 h-[1px] bg-gradient-to-r from-blue-400/30 via-transparent to-transparent pointer-events-none z-20" />
          
          {/* Soft inner left light spot */}
          <div className="absolute left-[-25%] top-[15%] w-[250px] h-[250px] bg-blue-500/[0.07] rounded-full blur-[70px] pointer-events-none z-0" />
          
          {/* Header branding */}
          <div className="text-center space-y-3 mb-9 relative z-10">
            <h1 className="text-4xl font-heading font-medium tracking-tight text-white">
              Log in
            </h1>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
              Log in to your account and seamlessly continue managing your projects, ideas, and progress just where you left off.
            </p>
          </div>

          {/* Error message card */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3 text-red-400 text-xs leading-relaxed animate-scale-in relative z-10">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Actions */}
          <form onSubmit={handleLogin} className="space-y-4 relative z-10">
            
            {/* Email input field */}
            <div className="relative group">
              <Mail className="w-4.5 h-4.5 absolute left-4.5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full pl-12 pr-4 h-13 bg-[#06080c] border border-white/[0.03] focus:border-blue-500/50 rounded-full text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 text-xs font-medium transition-all"
              />
            </div>

            {/* Password input field */}
            <div className="relative group">
              <Lock className="w-4.5 h-4.5 absolute left-4.5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-12 pr-12 h-13 bg-[#06080c] border border-white/[0.03] focus:border-blue-500/50 rounded-full text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 text-xs font-medium transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors focus:outline-none cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Log in submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-13 bg-[#181d25] hover:bg-[#202630] disabled:opacity-50 text-white font-medium rounded-full flex items-center justify-center gap-2 text-sm transition-all active:scale-[0.99] cursor-pointer mt-6"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Logging in...
                </span>
              ) : (
                <span>Log in</span>
              )}
            </button>
          </form>

          {/* Social login divider or elements */}
          <div className="grid grid-cols-3 gap-2.5 mt-5 relative z-10">
            {/* Facebook button */}
            <button className="flex items-center justify-center gap-1.5 h-11 border border-white/[0.03] bg-transparent hover:bg-white/[0.02] rounded-full text-[11px] text-zinc-400 font-medium transition cursor-pointer">
              <svg className="w-4 h-4 fill-zinc-400" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </button>

            {/* Google button */}
            <button className="flex items-center justify-center gap-1.5 h-11 border border-white/[0.03] bg-transparent hover:bg-white/[0.02] rounded-full text-[11px] text-zinc-400 font-medium transition cursor-pointer">
              <svg className="w-4 h-4 fill-zinc-400" viewBox="0 0 24 24">
                <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-6.887 4.114-4.68 0-8.46-3.87-8.46-8.514 0-4.644 3.78-8.514 8.46-8.514 2.11 0 3.99.774 5.46 2.05L19.89 1.13C17.9 0 15.19 0 12.24 0 5.58 0 0 5.376 0 12s5.58 12 12.24 12c6.96 0 11.52-4.838 11.52-11.72 0-.788-.09-1.547-.24-2.285H12.24z"/>
              </svg>
              Google
            </button>

            {/* Apple button */}
            <button className="flex items-center justify-center gap-1.5 h-11 border border-white/[0.03] bg-transparent hover:bg-white/[0.02] rounded-full text-[11px] text-zinc-400 font-medium transition cursor-pointer">
              <svg className="w-4 h-4 fill-zinc-400" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.67-.81 1.11-1.93.99-3.06-1 .04-2.2.67-2.92 1.49-.62.71-1.16 1.85-1.01 2.96 1.1.09 2.23-.55 2.94-1.39z"/>
              </svg>
              Apple
            </button>
          </div>

          {/* Footer sign up direction link */}
          <div className="mt-8 text-center relative z-10">
            <p className="text-xs text-zinc-500 font-medium">
              Didn&apos;t have an account?{' '}
              <a href="http://localhost:3000/signup" className="text-blue-500 hover:underline transition-colors">
                Sign up
              </a>
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
