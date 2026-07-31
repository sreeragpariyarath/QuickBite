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
  SUPER_ADMIN: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  OWNER: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  MANAGER: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  CASHIER: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
  KITCHEN_STAFF: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  DRIVER: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
  CUSTOMER: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-800/60">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">User Management</h1>
          <p className="text-xs text-gray-400 mt-1">
            Manage system roles, permissions, and identity verification
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#111827] border border-gray-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-[#111827] border border-gray-800 px-3 py-2 rounded-xl text-xs text-gray-400">
            <Filter className="w-4 h-4 text-emerald-400" />
            <span>Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-[#111827]">All Roles</option>
              <option value="SUPER_ADMIN" className="bg-[#111827]">SUPER_ADMIN</option>
              <option value="OWNER" className="bg-[#111827]">OWNER</option>
              <option value="MANAGER" className="bg-[#111827]">MANAGER</option>
              <option value="CASHIER" className="bg-[#111827]">CASHIER</option>
              <option value="KITCHEN_STAFF" className="bg-[#111827]">KITCHEN_STAFF</option>
              <option value="DRIVER" className="bg-[#111827]">DRIVER</option>
              <option value="CUSTOMER" className="bg-[#111827]">CUSTOMER</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#111827]/80 border border-gray-800/80 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#162032] border-b border-gray-800 text-gray-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">System Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 text-gray-300 font-sans">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-800/30 transition-all">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gray-800 border border-gray-700/60 flex items-center justify-center text-white font-bold text-xs">
                        {user.name ? user.name.slice(0, 2).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">{user.name || 'Unnamed User'}</p>
                        <p className="text-[10px] text-gray-500 font-mono">{user.id.slice(0, 8)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 space-y-1">
                    {user.email && (
                      <div className="flex items-center gap-1.5 text-gray-300">
                        <Mail className="w-3.5 h-3.5 text-gray-500" />
                        <span>{user.email}</span>
                      </div>
                    )}
                    {user.phone && (
                      <div className="flex items-center gap-1.5 text-gray-400 font-mono text-[11px]">
                        <Phone className="w-3.5 h-3.5 text-gray-500" />
                        <span>{user.phone}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-mono font-semibold ${
                        roleBadgeColors[user.role] || roleBadgeColors.CUSTOMER
                      }`}
                    >
                      <Shield className="w-3 h-3" />
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-medium">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-gray-400 text-xs">
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
