'use client';

import { ArrowUpRight } from 'lucide-react';
import { KpiStatItem } from '@/types';

interface KpiStatCardProps {
  stat: KpiStatItem;
}

export function KpiStatCard({ stat }: KpiStatCardProps) {
  const Icon = stat.icon;

  return (
    <div className="bg-white border border-slate-100/90 rounded-[24px] p-5 shadow-[0_8px_25px_rgba(0,0,0,0.025)] flex flex-col justify-between hover:shadow-[0_12px_30px_rgba(0,0,0,0.05)] transition-all duration-300">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-2xl ${stat.bgColor} ${stat.textColor} flex items-center justify-center shrink-0`}>
              <Icon className="w-4.5 h-4.5" />
            </div>
            <span className="text-xs font-semibold text-slate-500">{stat.title}</span>
          </div>
        </div>

        <div className="flex items-baseline justify-between mt-2">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{stat.value}</h2>
          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-0.5 ${stat.badgeBg}`}>
            <ArrowUpRight className="w-3 h-3" />
            {stat.change}
          </span>
        </div>
      </div>
    </div>
  );
}
