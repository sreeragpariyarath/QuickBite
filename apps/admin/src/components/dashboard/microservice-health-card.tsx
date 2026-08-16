'use client';

import { Database, CheckCircle2 } from 'lucide-react';
import { MicroserviceHealthItem } from '@/types';

interface MicroserviceHealthCardProps {
  services: MicroserviceHealthItem[];
}

export function MicroserviceHealthCard({ services }: MicroserviceHealthCardProps) {
  return (
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
        {services.map((svc) => (
          <div key={svc.id} className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
            <div className="flex items-center gap-3">
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  svc.status === 'Healthy'
                    ? 'bg-emerald-500'
                    : svc.status === 'Standby'
                    ? 'bg-blue-500'
                    : 'bg-amber-500'
                }`}
              />
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
  );
}
