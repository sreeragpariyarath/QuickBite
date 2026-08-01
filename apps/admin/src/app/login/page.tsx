'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Mail, Lock, ArrowRight, AlertCircle, Store, Clock, TrendingUp, Sparkles } from 'lucide-react';
import { AUTH_SERVICE_URL, setAuthToken } from '@/lib/api';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@quickbite.com');
  const [password, setPassword] = useState('admin123');
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
    <div className="min-h-screen bg-[#07090e] grid grid-cols-1 lg:grid-cols-12 overflow-hidden select-none">
      
      {/* LEFT COLUMN: Features Panel (Hidden on Mobile/Tablet) */}
      <div className="hidden lg:flex lg:col-span-5 relative bg-[#090d16] border-r border-zinc-900/60 p-12 flex-col justify-between overflow-hidden">
        {/* Animated Accent Gradients */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse duration-[8s]" />
        <div className="absolute -bottom-40 right-0 w-80 h-80 bg-emerald-700/5 rounded-full blur-3xl pointer-events-none" />

        {/* Food Table Spread Background Overlay */}
        <div className="absolute inset-0 z-0 opacity-15 mix-blend-luminosity grayscale pointer-events-none select-none scale-105 hover:scale-100 transition-transform duration-[12s]">
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000" 
            alt="Gourmet Background Spread" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Portal Branding / Logo */}
        <div className="z-10 flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-900/25">
            <span className="font-heading font-black text-white text-lg tracking-tight">Q</span>
          </div>
          <div>
            <span className="font-heading font-bold text-sm tracking-wide uppercase text-zinc-300">QuickBite</span>
            <span className="block text-[10px] font-bold text-emerald-500 uppercase tracking-widest leading-none mt-0.5">Control Center</span>
          </div>
        </div>

        {/* Value Propositions / Highlighting features */}
        <div className="z-10 space-y-8 my-auto max-w-sm">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/25 rounded-full text-[10px] font-bold text-emerald-400 tracking-wider uppercase">
              <Sparkles className="w-3 h-3 animate-spin duration-[4s]" />
              Partner Interface
            </div>
            <h2 className="text-3xl font-heading font-bold text-white tracking-tight leading-tight">
              Manage your food business in <span className="text-emerald-500">real-time</span>.
            </h2>
          </div>

          <div className="space-y-6 pt-2">
            
            {/* Feature 1 */}
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-900/80 border border-zinc-800/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-2xs">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-100 uppercase tracking-wider">Live Order Flow</h4>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">Accept, reject, prepare, and track delivery stages dynamically.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-900/80 border border-zinc-800/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-2xs">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-100 uppercase tracking-wider">Store Catalog Control</h4>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">Instantly add dishes, categories, and toggle item ordering availability.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-900/80 border border-zinc-800/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-2xs">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-100 uppercase tracking-wider">Performance Metrics</h4>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">Gain immediate insights into branch statistics and delivery performance.</p>
              </div>
            </div>

          </div>
        </div>

        {/* Portal Footer info */}
        <div className="z-10">
          <p className="text-[11px] font-medium text-zinc-500">
            Enterprise Operations Management System · v2.1.0
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN: Sign In Form (Center-aligned Panel) */}
      <div className="lg:col-span-7 flex items-center justify-center p-6 sm:p-12 relative">
        {/* Glow Accent Circle behind Login Box */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-emerald-500/[0.04] rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-[420px] space-y-8 relative z-10">
          
          {/* Header branding info */}
          <div className="flex flex-col items-center text-center">
            {/* Glowing Emerald Icon Shield container */}
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mb-5 text-emerald-400 shadow-inner">
              <ShieldCheck className="w-9 h-9 stroke-[1.75]" />
            </div>
            <h1 className="text-2xl font-heading font-bold tracking-tight text-white">
              Partner Portal
            </h1>
            <p className="text-xs font-medium text-zinc-400 mt-1.5 leading-relaxed">
              Please sign in using your authorized restaurant partner credentials.
            </p>
          </div>

          {/* Error Message Card */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3.5 text-red-400 text-xs leading-relaxed animate-scale-in">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Actions */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                Admin Email
              </label>
              <div className="relative group">
                <Mail className="w-4.5 h-4.5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@quickbite.com"
                  className="w-full pl-11 pr-4 py-3 bg-[#0d121f]/60 border border-zinc-800/80 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-xs font-medium transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  Password
                </label>
              </div>
              <div className="relative group">
                <Lock className="w-4.5 h-4.5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-[#0d121f]/60 border border-zinc-800/80 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-xs font-medium transition-all"
                />
              </div>
            </div>

            {/* Login button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-950/20 active:scale-[0.98] cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Authenticating...
                </span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Secure disclaimer footer */}
          <div className="text-center">
            <p className="text-[10px] font-medium text-zinc-500 leading-normal">
              Protected Admin Access · QuickBite Microservices Platform
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
