'use client';

import { Search, Filter } from 'lucide-react';
import { Select } from '@/components/ui';
import { USER_ROLE_OPTIONS } from '@/constants';

interface UsersFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  roleFilter: string;
  onRoleFilterChange: (value: string) => void;
}

export function UsersFilterBar({
  search,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
}: UsersFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="relative w-full sm:w-80">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name, email, or phone..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200/80 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-2xs transition-all"
        />
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        <Select
          options={USER_ROLE_OPTIONS}
          value={roleFilter}
          onChange={onRoleFilterChange}
          labelPrefix="Role:"
          icon={<Filter className="w-4 h-4 text-blue-600" />}
        />
      </div>
    </div>
  );
}
