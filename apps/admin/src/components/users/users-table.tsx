'use client';

import { UserItem } from '@/types';
import { UsersTableRow } from './users-table-row';

interface UsersTableProps {
  users: UserItem[];
}

export function UsersTable({ users }: UsersTableProps) {
  return (
    <div className="bg-white border border-slate-100/90 rounded-[24px] overflow-hidden shadow-[0_8px_25px_rgba(0,0,0,0.025)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 uppercase font-mono text-[10px]">
            <tr>
              <th className="px-6 py-4 font-semibold">User</th>
              <th className="px-6 py-4 font-semibold">Contact</th>
              <th className="px-6 py-4 font-semibold">System Role</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Joined Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 font-sans">
            {users.map((user) => (
              <UsersTableRow key={user.id} user={user} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
