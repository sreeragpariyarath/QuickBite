'use client';

import React from 'react';
import Link from 'next/link';

interface PartnerBrandLogoProps {
  href?: string;
  portalName?: string;
}

/**
 * Pure memoized Brand Logo component for Partner Portal.
 * Prevents unnecessary re-renders during active tab state changes.
 */
export const PartnerBrandLogo = React.memo(function PartnerBrandLogo({
  href = '/',
  portalName = 'Partner Portal',
}: PartnerBrandLogoProps) {
  return (
    <Link href={href} className="flex items-center gap-2.5 group select-none">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#335438] text-sm font-bold text-white shadow-xs group-hover:bg-[#28422c] transition-all duration-200">
        QB
      </span>
      <div className="flex flex-col">
        <span className="text-base font-extrabold text-zinc-900 tracking-tight leading-none">
          Quick<span className="text-[#335438]">Bite</span>
        </span>
        <span className="text-[10px] font-bold text-zinc-400 tracking-wide uppercase mt-0.5">
          {portalName}
        </span>
      </div>
    </Link>
  );
});
