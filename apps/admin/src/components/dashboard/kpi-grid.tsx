'use client';

import { KpiStatItem } from '@/types';
import { KpiStatCard } from './kpi-stat-card';

interface KpiGridProps {
  stats: KpiStatItem[];
}

export function KpiGrid({ stats }: KpiGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {stats.map((stat) => (
        <KpiStatCard key={stat.id} stat={stat} />
      ))}
    </div>
  );
}
