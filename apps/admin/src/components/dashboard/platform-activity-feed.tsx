'use client';

import { Bell } from 'lucide-react';
import { ActivityEventItem } from '@/types';

interface PlatformActivityFeedProps {
  events: ActivityEventItem[];
}

export function PlatformActivityFeed({ events }: PlatformActivityFeedProps) {
  return (
    <div className="bg-white border border-slate-100/90 rounded-[24px] p-6 shadow-[0_8px_25px_rgba(0,0,0,0.025)] flex flex-col">
      <div className="flex items-center gap-2.5 mb-6">
        <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <Bell className="w-4.5 h-4.5" />
        </div>
        <h3 className="font-bold text-slate-900 text-base">Platform Activity</h3>
      </div>

      <div className="space-y-3.5 flex-1">
        {events.map((evt) => {
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
  );
}
