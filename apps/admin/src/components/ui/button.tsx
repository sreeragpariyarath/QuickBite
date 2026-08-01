import React from 'react';
import { cn } from '@/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  loading?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  loading,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyle =
    'w-full h-12 font-medium rounded-full flex items-center justify-center gap-2 text-sm transition-all active:scale-[0.99] cursor-pointer disabled:opacity-50 disabled:pointer-events-none select-none';

  const variants = {
    primary: 'bg-[#181d25] hover:bg-[#202630] text-white border border-white/[0.04]',
    secondary: 'bg-transparent border border-white/[0.08] hover:bg-white/[0.02] text-zinc-300',
    danger: 'bg-red-950/30 hover:bg-red-900/40 text-red-400 border border-red-900/20',
    ghost: 'bg-transparent hover:bg-white/[0.02] text-zinc-400',
  };

  return (
    <button
      disabled={disabled || loading}
      className={cn(baseStyle, variants[variant], className)}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
