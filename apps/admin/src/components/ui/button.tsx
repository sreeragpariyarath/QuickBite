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
    primary: 'bg-slate-900 hover:bg-slate-800 text-white border border-slate-850 shadow-md shadow-slate-900/5',
    secondary: 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-700',
    danger: 'bg-red-50 hover:bg-red-100/80 text-red-600 border border-red-200/40',
    ghost: 'bg-transparent hover:bg-slate-150/50 text-slate-500',
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
