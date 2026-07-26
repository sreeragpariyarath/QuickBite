"use client";

import { motion } from "framer-motion";

interface TabsProps<T extends string> {
  tabs: ReadonlyArray<{ id: T; label: string }>;
  active: T;
  onChange: (id: T) => void;
}

export function Tabs<T extends string>({ tabs, active, onChange }: TabsProps<T>) {
  return (
    <div className="mb-4 flex border-b border-zinc-200 w-full">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`pb-2.5 text-sm font-semibold transition-all relative flex-1 text-center cursor-pointer ${
            active === tab.id
              ? 'text-zinc-950 border-b-2 border-[#335438]'
              : 'text-zinc-400 hover:text-zinc-600'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
