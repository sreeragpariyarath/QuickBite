'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Store, ShoppingBag, UserCheck, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth';

type Tab = 'restaurants' | 'orders' | 'staff';

interface PartnerHeaderProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  pendingOrdersCount?: number;
}

export function PartnerHeader({
  activeTab,
  onTabChange,
  pendingOrdersCount = 0,
}: PartnerHeaderProps) {
  const { profile, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  return (
    <>
      {/* Top Header Bar: Logo, Store Badge, Profile & Logout */}
      <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/90 backdrop-blur-md shadow-xs select-none">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Left Side: Brand Logo & Partner Badge */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#335438] text-sm font-bold text-white shadow-xs group-hover:bg-[#28422c] transition-colors">
                QB
              </span>
              <div className="flex flex-col">
                <span className="text-base font-extrabold text-zinc-900 tracking-tight leading-none">
                  Quick<span className="text-[#335438]">Bite</span>
                </span>
                <span className="text-[10px] font-bold text-zinc-400 tracking-wide uppercase mt-0.5">
                  Partner Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Right Side: Partner Profile Badge & Logout */}
          <div className="flex items-center gap-3">
            {profile && (
              <div className="flex items-center gap-2.5 bg-zinc-50 border border-zinc-200/80 px-3 py-1.5 rounded-2xl">
                <div className="h-7 w-7 rounded-xl bg-[#F2F3E9] text-[#335438] flex items-center justify-center font-extrabold text-xs border border-[#335438]/10 shrink-0">
                  {profile.name ? profile.name[0].toUpperCase() : 'P'}
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
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

        </div>
      </header>

      {/* Floating Bottom Navigation Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 select-none">
        <nav className="flex items-center gap-1.5 bg-white/95 backdrop-blur-xl border border-zinc-200/90 shadow-[0_12px_40px_rgba(0,0,0,0.12)] rounded-2xl p-1.5">
          <button
            onClick={() => onTabChange('restaurants')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 focus:outline-none cursor-pointer ${
              activeTab === 'restaurants'
                ? 'bg-[#335438] text-white shadow-md'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/70'
            }`}
          >
            <Store className="h-4 w-4" />
            <span>My Restaurants</span>
          </button>
          
          <button
            onClick={() => onTabChange('orders')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 focus:outline-none cursor-pointer relative ${
              activeTab === 'orders'
                ? 'bg-[#335438] text-white shadow-md'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/70'
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Incoming Orders</span>
            {pendingOrdersCount > 0 && (
              <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 text-[9px] font-extrabold text-white px-1 animate-pulse">
                {pendingOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onTabChange('staff')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 focus:outline-none cursor-pointer ${
              activeTab === 'staff'
                ? 'bg-[#335438] text-white shadow-md'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/70'
            }`}
          >
            <UserCheck className="h-4 w-4" />
            <span>Staff & Managers</span>
          </button>
        </nav>
      </div>
    </>
  );
}
