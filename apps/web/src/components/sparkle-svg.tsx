import React from 'react';

interface SparkleSVGProps {
  className?: string;
}

export function SparkleSVG({ className = '' }: SparkleSVGProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4L12 0Z" />
    </svg>
  );
}
