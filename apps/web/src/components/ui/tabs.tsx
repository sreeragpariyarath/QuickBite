'use client';

import { Smartphone, Mail } from 'lucide-react';

interface Tab<T extends string> {
  id: T;
  label: string;
}

interface TabsProps<T extends string> {
  tabs: readonly Tab<T>[];
  active: T;
  onChange: (id: T) => void;
}

export function Tabs<T extends string>({ tabs, active, onChange }: TabsProps<T>) {
  return (
    <div className="mb-6 flex border-b border-zinc-200 w-full relative">
      {tabs.map((tab, idx) => {
        const isActive = active === tab.id;
        return (
          <div key={tab.id} className="flex-1 flex items-center relative">
            {idx > 0 && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[1px] bg-zinc-200" />
            )}
            <button
              type="button"
              onClick={() => onChange(tab.id)}
              className={`pb-3 text-xs sm:text-sm font-semibold transition-all relative flex-1 flex items-center justify-center gap-2 cursor-pointer ${
                isActive
                  ? 'text-zinc-950 border-b-2 border-[#335438]'
                  : 'text-zinc-400 hover:text-zinc-600'
              }`}
            >
              {tab.id === 'phone' ? (
                <Smartphone className={`h-4 w-4 ${isActive ? 'text-[#335438]' : 'text-zinc-400'}`} />
              ) : (
                <Mail className={`h-4 w-4 ${isActive ? 'text-[#335438]' : 'text-zinc-400'}`} />
              )}
              <span>{tab.label}</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
