'use client';

import { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Shield,
  Phone,
  Mail,
  CheckCircle,
  MoreVertical,
  UserCheck,
  Plus,
} from 'lucide-react';

const mockUsers = [
  {
    id: '00000000-0000-0000-0000-000000000000',
    name: 'Super Admin',
    email: 'admin@quickbite.com',
    phone: '+919900000001',
    role: 'SUPER_ADMIN',
    isVerified: true,
    createdAt: '2026-06-01',
  },
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Rajesh Kumar (Owner)',
    email: 'rajesh@spicegarden.com',
    phone: '+919876543210',
    role: 'OWNER',
    isVerified: true,
    createdAt: '2026-06-15',
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Ananya Sharma (Manager)',
    email: 'ananya@spicegarden.com',
    phone: '+919876543211',
    role: 'MANAGER',
    isVerified: true,
    createdAt: '2026-07-02',
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Suresh V (Delivery)',
    email: null,
    phone: '+919876543212',
    role: 'DRIVER',
    isVerified: true,
    createdAt: '2026-07-10',
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    name: 'Priya Patel (Customer)',
    email: 'priya@example.com',
    phone: '+919876543213',
    role: 'CUSTOMER',
    isVerified: true,
    createdAt: '2026-07-18',
  },
];

const roleBadgeColors: Record<string, string> = {
  SUPER_ADMIN: 'bg-purple-50 text-purple-600 border-purple-200/60',
  OWNER: 'bg-emerald-50 text-emerald-600 border-emerald-200/60',
  MANAGER: 'bg-blue-50 text-blue-600 border-blue-200/60',
  CASHIER: 'bg-indigo-50 text-indigo-600 border-indigo-200/60',
  KITCHEN_STAFF: 'bg-amber-50 text-amber-600 border-amber-200/60',
  DRIVER: 'bg-teal-50 text-teal-600 border-teal-200/60',
  CUSTOMER: 'bg-slate-100 text-slate-600 border-slate-200/60',
};

export default function UsersManagementPage() {
  const [users, setUsers] = useState(mockUsers);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.name && u.name.toLowerCase().includes(search.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(search.toLowerCase())) ||
      (u.phone && u.phone.includes(search));
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">User Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage system roles, permissions, and identity verification
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
              onChange={(e) => setRoleFilter(e.target.value)}
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

      {/* Users Table */}
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
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/60 transition-all">
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
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-[11px] font-mono font-semibold ${
                        roleBadgeColors[user.role] || roleBadgeColors.CUSTOMER
                      }`}
                    >
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
