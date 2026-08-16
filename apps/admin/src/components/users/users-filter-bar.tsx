'use client';

import { Search, Filter } from 'lucide-react';

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
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200/80 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-sm"
        />
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="flex items-center gap-2 bg-white border border-slate-200/80 px-3.5 py-2.5 rounded-2xl text-xs text-slate-600 shadow-sm">
          <Filter className="w-4 h-4 text-blue-600" />
          <span>Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => onRoleFilterChange(e.target.value)}
            className="bg-transparent text-slate-900 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Roles</option>
            <option value="SUPER_ADMIN">SUPER_ADMIN</option>
            <option value="OWNER">OWNER</option>
            <option value="MANAGER">MANAGER</option>
            <option value="CASHIER">CASHIER</option>
            <option value="KITCHEN_STAFF">KITCHEN_STAFF</option>
            <option value="DRIVER">DRIVER</option>
            <option value="CUSTOMER">CUSTOMER</option>
          </select>
        </div>
      </div>
    </div>
  );
}
