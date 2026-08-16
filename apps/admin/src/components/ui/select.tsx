'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/utils';

export interface SelectOption {
  label: string;
  value: string;
  badgeColor?: string;
  icon?: React.ReactNode;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
  labelPrefix?: string;
}

export function Select({
  options,
  value,
  onChange,
  placeholder = 'Select option...',
  icon,
  className = '',
  labelPrefix,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn('relative inline-block w-full sm:w-auto', className)} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'w-full flex items-center justify-between gap-2.5 px-4 py-2.5 bg-white border border-slate-200/90 rounded-2xl text-xs font-semibold text-slate-800 shadow-2xs hover:bg-slate-50/80 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer',
          isOpen && 'border-blue-500 ring-2 ring-blue-500/20 bg-slate-50/50'
        )}
      >
        <div className="flex items-center gap-2 truncate">
          {icon && <span className="text-blue-600 shrink-0">{icon}</span>}
          {labelPrefix && <span className="text-slate-400 font-medium">{labelPrefix}</span>}
          <span className="truncate text-slate-900 font-bold">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown
          className={cn('w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0', isOpen && 'rotate-180 text-blue-600')}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/50 py-1.5 z-50 animate-in fade-in-50 zoom-in-95 duration-150">
          <div className="max-h-64 overflow-y-auto space-y-0.5 px-1.5 scrollbar-thin">
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer text-left',
                    isSelected
                      ? 'bg-blue-50/80 text-blue-600 font-bold'
                      : 'text-slate-700 hover:bg-slate-50 font-medium'
                  )}
                >
                  <div className="flex items-center gap-2 truncate">
                    {opt.icon}
                    <span className="truncate">{opt.label}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
