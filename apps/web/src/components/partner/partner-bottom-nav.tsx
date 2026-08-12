'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Store, ShoppingBag, UserCheck, LucideIcon } from 'lucide-react';

export type PartnerTab = 'restaurants' | 'orders' | 'staff';

export interface NavItemConfig {
  id: PartnerTab;
  label: string;
  icon: LucideIcon;
  badgeKey?: 'pendingOrders';
}

export const NAV_ITEMS: readonly NavItemConfig[] = [
  {
    id: 'restaurants',
    label: 'My Restaurants',
    icon: Store,
  },
  {
    id: 'orders',
    label: 'Incoming Orders',
    icon: ShoppingBag,
    badgeKey: 'pendingOrders',
  },
  {
    id: 'staff',
    label: 'Staff & Managers',
    icon: UserCheck,
  },
] as const;

interface PartnerBottomNavProps {
  activeTab: PartnerTab;
  onTabChange: (tab: PartnerTab) => void;
  pendingOrdersCount?: number;
}

/**
 * Data-driven Floating Bottom Navigation Bar with Framer Motion layout transitions.
 */
export const PartnerBottomNav = React.memo(function PartnerBottomNav({
  activeTab,
  onTabChange,
  pendingOrdersCount = 0,
}: PartnerBottomNavProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 select-none">
      <nav 
        role="tablist"
        aria-label="Partner Portal Navigation"
        className="flex items-center gap-1 bg-white/95 backdrop-blur-xl border border-zinc-200/90 shadow-[0_12px_40px_rgba(0,0,0,0.12)] rounded-2xl p-1.5"
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const showBadge = item.badgeKey === 'pendingOrders' && pendingOrdersCount > 0;

          return (
            <button
              key={item.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onTabChange(item.id)}
              className={`relative flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-colors duration-200 focus:outline-none cursor-pointer ${
                isActive ? 'text-white' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/60'
              }`}
            >
              {/* Active Tab Background Pill Animation */}
              {isActive && (
                <motion.div
                  layoutId="partner-active-pill"
                  className="absolute inset-0 bg-[#335438] rounded-xl shadow-md"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}

              <span className="relative z-10 flex items-center gap-2">
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
                {showBadge && (
                  <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 text-[9px] font-extrabold text-white px-1 animate-pulse shadow-xs">
                    {pendingOrdersCount}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
});
