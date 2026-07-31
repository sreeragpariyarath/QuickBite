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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-800/60">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Restaurant Management</h1>
          <p className="text-xs text-gray-400 mt-1">
            Platform listings, owner branch verification, and status toggles
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search restaurant, owner, address..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#111827] border border-gray-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 bg-[#111827] border border-gray-800 px-3 py-2 rounded-xl text-xs text-gray-400">
          <Filter className="w-4 h-4 text-emerald-400" />
          <span>City:</span>
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="bg-transparent text-white focus:outline-none cursor-pointer"
          >
            <option value="ALL" className="bg-[#111827]">All Cities</option>
            <option value="Bangalore" className="bg-[#111827]">Bangalore</option>
            <option value="Gurgaon" className="bg-[#111827]">Gurgaon</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#111827]/80 border border-gray-800/80 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#162032] border-b border-gray-800 text-gray-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="px-6 py-4">Restaurant</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Owner Name</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 text-gray-300">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-gray-800/30 transition-all">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <Store className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">{r.name}</p>
                        <p className="text-[10px] text-gray-500 font-mono">ID: {r.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-gray-300">
                      <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                      <span>{r.address}, <strong className="text-white">{r.city}</strong></span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-white">{r.ownerName}</span>
                  </td>
                  <td className="px-6 py-4">
                    {r.isActive ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-medium">
                        <XCircle className="w-3.5 h-3.5" />
                        Suspended / Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => toggleStatus(r.id)}
                      className={`px-3 py-1.5 rounded-xl font-medium text-xs transition-all cursor-pointer ${
                        r.isActive
                          ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20'
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
