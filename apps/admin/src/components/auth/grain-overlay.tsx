import React from 'react';
import { cn } from '@/utils';

interface GrainOverlayProps {
  opacityClass?: string;
  className?: string;
}

export function GrainOverlay({
  opacityClass = 'opacity-[0.05]',
  className = '',
}: GrainOverlayProps) {
  return (
    <div
      className={cn(
        'absolute inset-0 mix-blend-overlay pointer-events-none rounded-[36px] bg-repeat z-10',
        opacityClass,
        className
      )}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }}
    />
  );
}
