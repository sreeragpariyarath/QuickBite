'use client';

import React from 'react';
import { PartnerBrandLogo } from './partner-brand-logo';
import { PartnerUserBadge } from './partner-user-badge';
import { PartnerBottomNav, PartnerTab } from './partner-bottom-nav';

export type { PartnerTab };

export interface PartnerHeaderProps {
  activeTab: PartnerTab;
  onTabChange: (tab: PartnerTab) => void;
  pendingOrdersCount?: number;
}

/**
 * Enterprise Partner Header Container.
 * Orchestrates subcomponents: Brand Logo, User Badge, and Floating Bottom Navigation.
 */
export const PartnerHeader = React.memo(function PartnerHeader({
  activeTab,
  onTabChange,
  pendingOrdersCount = 0,
}: PartnerHeaderProps) {
  return (
    <>
      {/* Top Header Bar: Logo & User Badge */}
      <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/90 backdrop-blur-md shadow-xs select-none">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <PartnerBrandLogo />
          <PartnerUserBadge />
        </div>
      </header>

      {/* Floating Bottom Navigation Bar */}
      <PartnerBottomNav
        activeTab={activeTab}
        onTabChange={onTabChange}
        pendingOrdersCount={pendingOrdersCount}
      />
    </>
  );
});
