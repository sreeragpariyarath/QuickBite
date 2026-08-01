'use client';

import { useState } from 'react';
import { Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { GrainOverlay } from '@/components/auth/grain-overlay';
import { TextField, Button, Card } from '@/components/ui';
import { PORTAL_TITLE, PORTAL_DESCRIPTION } from '@/constants';

export default function AdminLoginPage() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('admin@quickbite.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Connection to authentication service failed.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden select-none font-sans">
      
      {/* Page Matte Grain/Noise Overlay */}
      <GrainOverlay opacityClass="opacity-[0.015]" className="rounded-none z-0" />

      {/* Dynamic Dot Grid Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-40" 
        style={{
          backgroundImage: 'radial-gradient(#cbd5e1 1.2px, transparent 1.2px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Food-themed Peach/Mint & Indigo Mesh Spotlights */}
      <div className="absolute -top-[15%] -left-[10%] w-[600px] h-[600px] bg-orange-200/30 rounded-full blur-[130px] pointer-events-none z-0" />
      <div className="absolute -bottom-[15%] -right-[5%] w-[600px] h-[600px] bg-emerald-100/40 rounded-full blur-[130px] pointer-events-none z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-blue-200/25 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Decorative blurred glass ring accents */}
      <div className="absolute top-[12%] right-[8%] w-80 h-80 rounded-full bg-gradient-to-br from-amber-100/20 to-orange-100/30 blur-2xl pointer-events-none z-0" />
      <div className="absolute bottom-[10%] left-[8%] w-96 h-96 rounded-full bg-gradient-to-br from-emerald-50/15 to-teal-100/35 blur-2xl pointer-events-none z-0" />

      {/* Card Wrapper with Outer Glow */}
      <div className="w-full max-w-[500px] relative group">
        
        {/* Left-side cyan border glow overlay (Outer highlight) */}
        <div className="absolute -inset-[1px] rounded-[36px] bg-gradient-to-r from-blue-500/25 via-indigo-500/10 to-transparent blur-[3px] opacity-100 pointer-events-none z-0" />
        
        {/* Main Card Container */}
        <Card className="w-full p-8 sm:p-11 z-10">
          
          {/* Inner border light accents */}
          <div className="absolute left-0 top-0 bottom-0 w-[1.5px] bg-gradient-to-b from-blue-500/25 via-indigo-500/5 to-transparent pointer-events-none z-20" />
          <div className="absolute left-0 right-0 top-0 h-[1px] bg-gradient-to-r from-blue-500/20 via-transparent to-transparent pointer-events-none z-20" />
          
          {/* Soft inner left light spot */}
          <div className="absolute left-[-25%] top-[15%] w-[250px] h-[250px] bg-blue-500/[0.03] rounded-full blur-[70px] pointer-events-none z-0" />
          
          {/* Matte Grain/Noise Overlay */}
          <GrainOverlay opacityClass="opacity-[0.015]" />
          
          {/* Header branding */}
          <div className="text-center space-y-3 mb-9 relative z-10">
            <h1 className="text-4xl font-heading font-semibold tracking-tight text-slate-900">
              {PORTAL_TITLE}
            </h1>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              {PORTAL_DESCRIPTION}
            </p>
          </div>

          {/* Error message card */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600 text-xs leading-relaxed animate-scale-in relative z-10">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Actions */}
          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            
            {/* Email input field */}
            <TextField
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your partner email address"
              icon={<Mail className="w-4.5 h-4.5" />}
            />

            {/* Password input field */}
            <TextField
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your secure password"
              icon={<Lock className="w-4.5 h-4.5" />}
              actionButton={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-zinc-500 hover:text-zinc-300 transition-colors focus:outline-none cursor-pointer flex items-center"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            {/* Log in submit button */}
            <Button type="submit" loading={loading} className="mt-6">
              Sign In to Dashboard
            </Button>
          </form>

          {/* Footer spacer */}
          <div className="pt-2 relative z-10" />

        </Card>
      </div>

    </div>
  );
}
