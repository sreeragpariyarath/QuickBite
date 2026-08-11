'use client';

import { useState } from 'react';
import { Store, MapPin, CheckCircle2, XCircle, Search, Filter, Clock, AlertTriangle, ShieldCheck, UserCheck } from 'lucide-react';

interface StaffMember {
  id: string;
  name?: string;
  phone?: string;
  email?: string;
  role: 'MANAGER' | 'CASHIER' | 'KITCHEN_STAFF';
}

interface RestaurantItem {
  id: string;
  name: string;
  ownerId: string;
  ownerName: string;
  address: string;
  city: string;
  status: 'PENDING_APPROVAL' | 'ACTIVE' | 'SUSPENDED' | 'REJECTED';
  isActive: boolean;
  fssaiLicense?: string;
  gstin?: string;
  createdAt: string;
  staff?: StaffMember[];
}

const mockRestaurants: RestaurantItem[] = [
  {
    id: 'rest-101',
    name: 'Spice Garden Fine Dining',
    ownerId: '11111111-1111-1111-1111-111111111111',
    ownerName: 'Rajesh Kumar',
    address: '100 Feet Road, Indiranagar',
    city: 'Bangalore',
    status: 'ACTIVE',
    isActive: true,
    fssaiLicense: '11223344556677',
    createdAt: '2026-06-20',
    staff: [
      { id: 'stf-1', name: 'Ananya Sharma', phone: '+919876543211', role: 'MANAGER' },
    ],
  },
  {
    id: 'rest-102',
    name: 'Urban Burger Club',
    ownerId: '11111111-1111-1111-1111-111111111111',
    ownerName: 'Rajesh Kumar',
    address: 'Koramangala 5th Block',
    city: 'Bangalore',
    status: 'PENDING_APPROVAL',
    isActive: false,
    fssaiLicense: '99887766554433',
    createdAt: '2026-07-04',
  },
  {
    id: 'rest-103',
    name: 'Tandoori Nights',
    ownerId: '55555555-5555-5555-5555-555555555555',
    ownerName: 'Vikram Singh',
    address: 'MG Road, Sector 14',
    city: 'Gurgaon',
    status: 'SUSPENDED',
    isActive: false,
    fssaiLicense: '44556677889900',
    createdAt: '2026-07-22',
  },
];

export default function RestaurantsManagementPage() {
  const [restaurants, setRestaurants] = useState<RestaurantItem[]>(mockRestaurants);
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const toggleStatus = (id: string, currentStatus: string) => {
    setRestaurants((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
          return {
            ...r,
            status: nextStatus,
            isActive: nextStatus === 'ACTIVE',
          };
        }
        return r;
      })
    );
  };

  const filtered = restaurants.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.address.toLowerCase().includes(search.toLowerCase()) ||
      r.ownerName.toLowerCase().includes(search.toLowerCase());
    const matchesCity = cityFilter === 'ALL' || r.city.toLowerCase() === cityFilter.toLowerCase();
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesCity && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Restaurant Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Super Admin Partner Approval Gateway & Branch Oversight
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search restaurant, owner, address..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200/80 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-2 bg-white border border-slate-200/80 px-3.5 py-2.5 rounded-2xl text-xs text-slate-600 shadow-sm">
            <Filter className="w-4 h-4 text-blue-600" />
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-slate-900 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING_APPROVAL">PENDING_APPROVAL</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="SUSPENDED">SUSPENDED</option>
            </select>
          </div>

          {/* City Filter */}
          <div className="flex items-center gap-2 bg-white border border-slate-200/80 px-3.5 py-2.5 rounded-2xl text-xs text-slate-600 shadow-sm">
            <span>City:</span>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="bg-transparent text-slate-900 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Cities</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Gurgaon">Gurgaon</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-100/90 rounded-[24px] overflow-hidden shadow-[0_8px_25px_rgba(0,0,0,0.025)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 uppercase font-mono text-[10px]">
              <tr>
                <th className="px-6 py-4 font-semibold">Restaurant</th>
                <th className="px-6 py-4 font-semibold">Location</th>
                <th className="px-6 py-4 font-semibold">Owner & FSSAI</th>
                <th className="px-6 py-4 font-semibold">Approval Status</th>
                <th className="px-6 py-4 text-right font-semibold">Super Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/60 transition-all">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                        <Store className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{r.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">ID: {r.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{r.address}, <strong className="text-slate-900 font-semibold">{r.city}</strong></span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900">{r.ownerName}</p>
                    {r.fssaiLicense && (
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">FSSAI: {r.fssaiLicense}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {r.status === 'ACTIVE' ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-600 font-semibold text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Active & Live
                      </span>
                    ) : r.status === 'PENDING_APPROVAL' ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/60 text-amber-600 font-semibold text-xs animate-pulse">
                        <Clock className="w-3.5 h-3.5" />
                        Pending Approval
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-50 border border-red-200/60 text-red-600 font-semibold text-xs">
                        <XCircle className="w-3.5 h-3.5" />
                        Suspended
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => toggleStatus(r.id, r.status)}
                      className={`px-3.5 py-1.5 rounded-full font-semibold text-xs transition-all cursor-pointer ${
                        r.status === 'ACTIVE'
                          ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200/60'
                          : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200/60'
                      }`}
                    >
                      {r.status === 'ACTIVE' ? 'Suspend Listing' : 'Approve & Activate'}
                    </button>
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
