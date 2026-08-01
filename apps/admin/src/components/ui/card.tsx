import React from 'react';
import { cn } from '@/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-[#0b0e15]/95 border border-white/[0.03] rounded-[36px] shadow-2xl overflow-hidden relative',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
