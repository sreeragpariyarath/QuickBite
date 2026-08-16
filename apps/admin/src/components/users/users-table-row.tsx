'use client';

import { Mail, Phone, Shield, CheckCircle } from 'lucide-react';
import { UserItem } from '@/types';
import { ROLE_BADGE_COLORS } from '@/constants';

interface UsersTableRowProps {
  user: UserItem;
}

export function UsersTableRow({ user }: UsersTableRowProps) {
  const badgeStyle = ROLE_BADGE_COLORS[user.role] || ROLE_BADGE_COLORS.CUSTOMER;

  return (
    <tr className="hover:bg-slate-50/60 transition-all">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
            {user.name ? user.name.slice(0, 2).toUpperCase() : 'U'}
          </div>
          <div>
            <p className="font-bold text-slate-900 text-sm">{user.name || 'Unnamed User'}</p>
            <p className="text-[10px] text-slate-400 font-mono">{user.id.slice(0, 8)}...</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 space-y-1">
        {user.email && (
          <div className="flex items-center gap-1.5 text-slate-600">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            <span>{user.email}</span>
          </div>
        )}
        {user.phone && (
          <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px]">
            <Phone className="w-3.5 h-3.5 text-slate-400" />
            <span>{user.phone}</span>
          </div>
        )}
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-[11px] font-mono font-semibold ${badgeStyle}`}>
          <Shield className="w-3 h-3" />
          {user.role}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-600 text-xs font-semibold">
          <CheckCircle className="w-3.5 h-3.5" />
          Verified
        </span>
      </td>
      <td className="px-6 py-4 font-mono text-slate-400 text-xs">
        {user.createdAt}
      </td>
    </tr>
  );
}
