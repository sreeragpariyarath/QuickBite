'use client';

import { useState } from 'react';
import { Store, MapPin, CheckCircle2, XCircle, Search, Filter, Plus, Building2 } from 'lucide-react';

const mockRestaurants = [
  {
    id: 'rest-101',
    name: 'Spice Garden Fine Dining',
    ownerId: '11111111-1111-1111-1111-111111111111',
    ownerName: 'Rajesh Kumar',
    address: '100 Feet Road, Indiranagar',
    city: 'Bangalore',
    isActive: true,
    createdAt: '2026-06-20',
  },
  {
    id: 'rest-102',
    name: 'Urban Burger Club',
    ownerId: '11111111-1111-1111-1111-111111111111',
    ownerName: 'Rajesh Kumar',
    address: 'Koramangala 5th Block',
    city: 'Bangalore',
    isActive: true,
    createdAt: '2026-07-04',
  },
  {
    id: 'rest-103',
    name: 'Tandoori Nights',
    ownerId: '55555555-5555-5555-5555-555555555555',
    ownerName: 'Vikram Singh',
    address: 'MG Road, Sector 14',
    city: 'Gurgaon',
    isActive: false,
    createdAt: '2026-07-22',
  },
];

export default function RestaurantsManagementPage() {
  const [restaurants, setRestaurants] = useState(mockRestaurants);
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('ALL');

  const toggleStatus = (id: string) => {
    setRestaurants((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r))
    );
  };

  const filtered = restaurants.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.address.toLowerCase().includes(search.toLowerCase()) ||
      r.ownerName.toLowerCase().includes(search.toLowerCase());
    const matchesCity = cityFilter === 'ALL' || r.city.toLowerCase() === cityFilter.toLowerCase();
    return matchesSearch && matchesCity;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Restaurant Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Platform listings, owner branch verification, and status toggles
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

        <div className="flex items-center gap-2 bg-white border border-slate-200/80 px-3.5 py-2.5 rounded-2xl text-xs text-slate-600 shadow-sm">
          <Filter className="w-4 h-4 text-blue-600" />
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

      {/* Table */}
      <div className="bg-white border border-slate-100/90 rounded-[24px] overflow-hidden shadow-[0_8px_25px_rgba(0,0,0,0.025)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 uppercase font-mono text-[10px]">
              <tr>
                <th className="px-6 py-4 font-semibold">Restaurant</th>
                <th className="px-6 py-4 font-semibold">Location</th>
                <th className="px-6 py-4 font-semibold">Owner Name</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/60 transition-all">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
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
                    <span className="font-semibold text-slate-900">{r.ownerName}</span>
                  </td>
                  <td className="px-6 py-4">
                    {r.isActive ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-600 font-semibold text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-50 border border-red-200/60 text-red-600 font-semibold text-xs">
                        <XCircle className="w-3.5 h-3.5" />
                        Suspended / Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => toggleStatus(r.id)}
                      className={`px-3.5 py-1.5 rounded-full font-semibold text-xs transition-all cursor-pointer ${
                        r.isActive
                          ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200/60'
                          : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200/60'
                      }`}
                    >
                      {r.isActive ? 'Suspend' : 'Approve & Activate'}
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
