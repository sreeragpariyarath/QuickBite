'use client';

import {
  Users,
  Store,
  ShoppingBag,
  TrendingUp,
  Server,
  Activity,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Database,
  Bell,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

export default function DashboardOverviewPage() {
  const stats = [
    {
      title: 'Total Platform Users',
      value: '1,420',
      change: '+12.4%',
      icon: Users,
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      badgeBg: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Active Restaurants',
      value: '84',
      change: '+6.2%',
      icon: Store,
      color: 'purple',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      badgeBg: 'bg-purple-50 text-purple-600',
    },
    {
      title: 'Total Orders Processed',
      value: '3,890',
      change: '+18.1%',
      icon: ShoppingBag,
      color: 'emerald',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      badgeBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Gross Platform Revenue',
      value: '₹4,82,900',
      change: '+24.5%',
      icon: TrendingUp,
      color: 'amber',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
      badgeBg: 'bg-amber-50 text-amber-600',
    },
  ];

  const microservices = [
    { name: 'auth-service', port: 3000, status: 'Healthy', db: 'auth_db', uptime: '99.98%' },
    { name: 'restaurant-service', port: 3001, status: 'Healthy', db: 'restaurant_db', uptime: '99.95%' },
    { name: 'order-service', port: 3002, status: 'Healthy', db: 'order_db', uptime: '99.99%' },
    { name: 'notification-service', port: 3003, status: 'Standby', db: 'Event-driven', uptime: '100%' },
  ];

  const recentEvents = [
    { 
      id: 1, 
      title: 'New Restaurant Registered', 
      desc: 'Saffron Spice Kitchen (Bangalore)', 
      time: '5m ago', 
      icon: Store,
      iconBg: 'bg-blue-50 text-blue-600'
    },
    { 
      id: 2, 
      title: 'Order Delivered', 
      desc: 'Order #ORD-8921 (₹640 COD)', 
      time: '12m ago', 
      icon: ShoppingBag,
      iconBg: 'bg-emerald-50 text-emerald-600'
    },
    { 
      id: 3, 
      title: 'Role Promoted', 
      desc: 'user_9812 assigned to MANAGER', 
      time: '45m ago', 
      icon: Users,
      iconBg: 'bg-purple-50 text-purple-600'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Overview</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time platform metrics across QuickBite microservices
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200/60 px-3.5 py-1.5 rounded-full w-fit">
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
              className="bg-white border border-slate-100/90 rounded-[24px] p-5 shadow-[0_8px_25px_rgba(0,0,0,0.025)] flex flex-col justify-between hover:shadow-[0_12px_30px_rgba(0,0,0,0.05)] transition-all duration-300"
            >
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
        })}
      </div>

      {/* Grid: Microservice Health & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Microservices Health Monitor */}
        <div className="lg:col-span-2 bg-white border border-slate-100/90 rounded-[24px] p-6 shadow-[0_8px_25px_rgba(0,0,0,0.025)]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Database className="w-4.5 h-4.5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Backend Microservices</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
              <Database className="w-3.5 h-3.5" /> PostgreSQL DB-per-service
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {microservices.map((svc, i) => (
              <div key={i} className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <div>
                    <p className="text-sm font-bold text-slate-900 font-mono">{svc.name}</p>
                    <p className="text-xs text-slate-400">Port {svc.port} · {svc.db}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-mono text-slate-400">Uptime {svc.uptime}</p>
                  </div>
                  {svc.status === 'Healthy' ? (
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Healthy
                    </span>
                  ) : (
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Standby
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live System Activity Feed */}
        <div className="bg-white border border-slate-100/90 rounded-[24px] p-6 shadow-[0_8px_25px_rgba(0,0,0,0.025)] flex flex-col">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Bell className="w-4.5 h-4.5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Platform Activity</h3>
          </div>

          <div className="space-y-3.5 flex-1">
            {recentEvents.map((evt) => {
              const Icon = evt.icon;
              return (
                <div
                  key={evt.id}
                  className="p-3.5 bg-slate-50/70 border border-slate-100/80 rounded-2xl flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl ${evt.iconBg} flex items-center justify-center shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{evt.title}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{evt.desc}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">{evt.time}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
