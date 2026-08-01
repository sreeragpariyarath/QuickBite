import React from 'react';
import { cn } from '@/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white/90 backdrop-blur-xl border border-slate-200/50 rounded-[36px] shadow-xl shadow-slate-100/60 overflow-hidden relative',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
