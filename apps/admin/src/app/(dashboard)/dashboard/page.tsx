'use client';

import {
  DASHBOARD_STATS,
  MICROSERVICES_HEALTH,
  RECENT_PLATFORM_EVENTS,
} from '@/constants';
import {
  DashboardHeader,
  KpiGrid,
  MicroserviceHealthCard,
  PlatformActivityFeed,
} from '@/components/dashboard';

export default function DashboardOverviewPage() {
  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <DashboardHeader />

      {/* Primary KPI Metrics Grid */}
      <KpiGrid stats={DASHBOARD_STATS} />

      {/* Grid: Microservice Health & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <MicroserviceHealthCard services={MICROSERVICES_HEALTH} />
        <PlatformActivityFeed events={RECENT_PLATFORM_EVENTS} />
      </div>
    </div>
  );
}
