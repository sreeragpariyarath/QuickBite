import React from 'react';
import { cn } from '@/utils';

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  actionButton?: React.ReactNode;
}

export function TextField({
  label,
  error,
  icon,
  actionButton,
  className = '',
  id,
  ...props
}: TextFieldProps) {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label htmlFor={id} className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div className="absolute left-4.5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors z-10 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={id}
          className={cn(
            'w-full h-12 bg-[#06080c] border rounded-full text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-4 text-xs font-medium transition-all',
            icon ? 'pl-12' : 'pl-5',
            actionButton ? 'pr-12' : 'pr-5',
            error
              ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/10'
              : 'border-white/[0.03] focus:border-blue-500/50 focus:ring-blue-500/10',
            className
          )}
          {...props}
        />
        {actionButton && (
          <div className="absolute right-4.5 top-1/2 -translate-y-1/2 z-10">
            {actionButton}
          </div>
        )}
      </div>
      {error && (
        <p className="text-[10px] text-red-400 pl-1">{error}</p>
      )}
    </div>
  );
}
