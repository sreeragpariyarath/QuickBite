'use client';

import {
  Users,
  Store,
  ShoppingBag,
  TrendingUp,
  Server,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpRight,
} from 'lucide-react';

export default function DashboardOverviewPage() {
  const stats = [
    {
      title: 'Total Platform Users',
      value: '1,420',
      change: '+12.4%',
      icon: Users,
      color: 'emerald',
    },
    {
      title: 'Active Restaurants',
      value: '84',
      change: '+6.2%',
      icon: Store,
      color: 'blue',
    },
    {
      title: 'Total Orders Processed',
      value: '3,890',
      change: '+18.1%',
      icon: ShoppingBag,
      color: 'amber',
    },
    {
      title: 'Gross Platform Revenue',
      value: '₹4,82,900',
      change: '+24.5%',
      icon: TrendingUp,
      color: 'purple',
    },
  ];

  const microservices = [
    { name: 'auth-service', port: 3000, status: 'Healthy', db: 'auth_db', uptime: '99.98%' },
    { name: 'restaurant-service', port: 3001, status: 'Healthy', db: 'restaurant_db', uptime: '99.95%' },
    { name: 'order-service', port: 3002, status: 'Healthy', db: 'order_db', uptime: '99.99%' },
    { name: 'notification-service', port: 3003, status: 'Standby', db: 'Event-driven', uptime: '100%' },
  ];

  const recentEvents = [
    { id: 1, title: 'New Restaurant Registered', desc: 'Saffron Spice Kitchen (Bangalore)', time: '5m ago', type: 'info' },
    { id: 2, title: 'Order Delivered', desc: 'Order #ORD-8921 (₹640 COD)', time: '12m ago', type: 'success' },
    { id: 3, title: 'Role Promoted', desc: 'user_9812 assigned to MANAGER', time: '45m ago', type: 'warning' },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-800/60">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">System Overview</h1>
          <p className="text-xs text-gray-400 mt-1">
            Real-time platform metrics across QuickBite microservices
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-xl w-fit">
          <Activity className="w-4 h-4 animate-pulse" />
          <span>System All Operational</span>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-[#111827]/80 border border-gray-800/80 rounded-2xl p-5 hover:border-gray-700/80 transition-all shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3" />
                  {stat.change}
                </span>
              </div>
              <p className="text-xs text-gray-400 font-medium">{stat.title}</p>
              <h2 className="text-2xl font-bold text-white mt-1">{stat.value}</h2>
            </div>
          );
        })}
      </div>

      {/* Grid: Microservice Health & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Microservices Health Monitor */}
        <div className="lg:col-span-2 bg-[#111827]/80 border border-gray-800/80 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-emerald-400" />
              <h3 className="font-semibold text-white text-base">Backend Microservices</h3>
            </div>
            <span className="text-xs text-gray-500">PostgreSQL DB-per-service</span>
          </div>

          <div className="divide-y divide-gray-800/60">
            {microservices.map((svc, i) => (
              <div key={i} className="py-3.5 flex items-center justify-between first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <div>
                    <p className="text-sm font-medium text-white font-mono">{svc.name}</p>
                    <p className="text-xs text-gray-500">Port {svc.port} · {svc.db}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-mono text-gray-400">Uptime {svc.uptime}</p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {svc.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live System Activity Feed */}
        <div className="bg-[#111827]/80 border border-gray-800/80 rounded-2xl p-6 shadow-lg flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-white text-base">Platform Activity</h3>
          </div>

          <div className="space-y-4 flex-1">
            {recentEvents.map((evt) => (
              <div
                key={evt.id}
                className="p-3.5 bg-[#162032] border border-gray-800/80 rounded-xl flex items-start justify-between gap-3"
              >
                <div>
                  <p className="text-xs font-semibold text-white">{evt.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{evt.desc}</p>
                </div>
                <span className="text-[10px] text-gray-500 font-mono shrink-0">{evt.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
