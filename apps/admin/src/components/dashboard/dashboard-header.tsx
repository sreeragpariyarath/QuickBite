'use client';

import { Activity } from 'lucide-react';

interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
  isOperational?: boolean;
}

export function DashboardHeader({
  title = 'System Overview',
  subtitle = 'Real-time platform metrics across QuickBite microservices',
  isOperational = true,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
        <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
      </div>
      
      {isOperational && (
        <div className="flex items-center gap-2 text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200/60 px-3.5 py-1.5 rounded-full w-fit shadow-2xs">
          <Activity className="w-4 h-4 animate-pulse" />
          <span>System All Operational</span>
        </div>
      )}
    </div>
  );
}
