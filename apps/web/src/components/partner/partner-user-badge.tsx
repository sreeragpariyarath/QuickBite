'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth';

/**
 * Isolated User Badge & Logout component.
 * Encapsulates auth state & logout handler cleanly.
 */
export const PartnerUserBadge = React.memo(function PartnerUserBadge() {
  const { profile, logout } = useAuth();
  const router = useRouter();

  const handleLogout = useCallback(() => {
    logout();
    router.push('/admin/login');
  }, [logout, router]);

  const userInitial = profile?.name ? profile.name[0].toUpperCase() : 'P';

  return (
    <div className="flex items-center gap-3 select-none">
      {profile && (
        <div className="flex items-center gap-2.5 bg-zinc-50 border border-zinc-200/80 px-3 py-1.5 rounded-2xl">
          <div className="h-7 w-7 rounded-xl bg-[#F2F3E9] text-[#335438] flex items-center justify-center font-extrabold text-xs border border-[#335438]/10 shrink-0">
            {userInitial}
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-bold text-zinc-900 leading-tight truncate max-w-[130px]">
              {profile.name || 'Partner'}
            </span>
            <span className="text-[10px] font-medium text-zinc-400 truncate max-w-[140px]">
              {profile.email}
            </span>
          </div>
        </div>
      )}

      <button
        onClick={handleLogout}
        className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 text-xs font-bold text-zinc-600 hover:text-red-600 hover:bg-red-50 border border-zinc-200/80 hover:border-red-200 rounded-xl transition cursor-pointer"
        title="Log out of Partner Portal"
        aria-label="Logout of Partner Portal"
      >
        <LogOut className="h-4 w-4 stroke-[2]" />
        <span className="hidden sm:inline">Logout</span>
      </button>
    </div>
  );
});
