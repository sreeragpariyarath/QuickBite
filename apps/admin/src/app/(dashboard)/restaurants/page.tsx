'use client';

import { useEffect, useState, useCallback } from 'react';
import { 
  Store, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter, 
  Clock, 
  Loader2, 
  RefreshCw,
  ShieldCheck,
  Trash2
} from 'lucide-react';
import { request, ApiError } from '@/lib/api-client';
import { RESTAURANT_SERVICE_URL } from '@/lib/api';
import { RestaurantDetailModal } from '@/components/restaurant-detail-modal';

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
  description?: string;
  address: string;
  city: string;
  status: 'PENDING_APPROVAL' | 'ACTIVE' | 'SUSPENDED' | 'REJECTED';
  isActive: boolean;
  fssaiLicense?: string;
  contactPhone?: string;
  gstin?: string;
  createdAt: string;
  staff?: StaffMember[];
}

export default function RestaurantsManagementPage() {
  const [restaurants, setRestaurants] = useState<RestaurantItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionBusyId, setActionBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [selectedDetailId, setSelectedDetailId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Fetch all live restaurants from restaurant-service
  const fetchRestaurants = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await request<RestaurantItem[]>(
        RESTAURANT_SERVICE_URL,
        '/restaurants?all=true',
        { auth: true }
      );
      setRestaurants(data);
    } catch (err) {
      console.error('Failed to load restaurants:', err);
      setError(err instanceof ApiError ? err.message : 'Failed to connect to restaurant-service');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  // Toggle or Update Store Status (Super Admin Approval / Suspension)
  const handleUpdateStatus = async (id: string, targetStatus: 'ACTIVE' | 'SUSPENDED' | 'PENDING_APPROVAL') => {
    setActionBusyId(id);
    try {
      await request(
        RESTAURANT_SERVICE_URL,
        `/restaurants/${id}/status`,
        {
          method: 'PATCH',
          auth: true,
          body: { status: targetStatus },
        }
      );
      // Optimistic update + refresh
      setRestaurants((prev) =>
        prev.map((r) =>
          r.id === id
            ? { ...r, status: targetStatus, isActive: targetStatus === 'ACTIVE' }
            : r
        )
      );
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Failed to update store status');
    } finally {
      setActionBusyId(null);
    }
  };

  const handleDeleteStore = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    setActionBusyId(id);
    try {
      await request(
        RESTAURANT_SERVICE_URL,
        `/restaurants/${id}`,
        {
          method: 'DELETE',
          auth: true,
        }
      );
      setRestaurants((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Failed to delete store');
    } finally {
      setActionBusyId(null);
    }
  };

  const filtered = restaurants.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.address.toLowerCase().includes(search.toLowerCase()) ||
      r.city.toLowerCase().includes(search.toLowerCase()) ||
      r.ownerId.toLowerCase().includes(search.toLowerCase());
    const matchesCity = cityFilter === 'ALL' || r.city.toLowerCase() === cityFilter.toLowerCase();
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesCity && matchesStatus;
  });

  const availableCities = Array.from(new Set(restaurants.map((r) => r.city))).filter(Boolean);

  return (
    <div className="space-y-6 select-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Restaurant Management
            <ShieldCheck className="w-5 h-5 text-blue-600" />
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Super Admin Partner Approval Gateway & Operational Oversight
          </p>
        </div>

        <button
          onClick={fetchRestaurants}
          disabled={loading}
          className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-2xl text-xs font-semibold text-slate-700 shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Controls & Filtering Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search restaurant, owner ID, city..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200/80 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-xs"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-2 bg-white border border-slate-200/80 px-3.5 py-2.5 rounded-2xl text-xs text-slate-600 shadow-xs">
            <Filter className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-slate-900 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses ({restaurants.length})</option>
              <option value="PENDING_APPROVAL">Pending Approval ({restaurants.filter(r => r.status === 'PENDING_APPROVAL').length})</option>
              <option value="ACTIVE">Active & Live ({restaurants.filter(r => r.status === 'ACTIVE').length})</option>
              <option value="SUSPENDED">Suspended ({restaurants.filter(r => r.status === 'SUSPENDED').length})</option>
            </select>
          </div>

          {/* City Filter */}
          {availableCities.length > 0 && (
            <div className="flex items-center gap-2 bg-white border border-slate-200/80 px-3.5 py-2.5 rounded-2xl text-xs text-slate-600 shadow-xs">
              <span>City:</span>
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="bg-transparent text-slate-900 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Cities</option>
                {availableCities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-slate-100/90 rounded-[24px] overflow-hidden shadow-[0_8px_25px_rgba(0,0,0,0.025)]">
        {loading && restaurants.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
            <Loader2 className="w-7 h-7 animate-spin text-blue-600" />
            <p className="text-xs font-medium">Fetching store submissions from database...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
            <Store className="w-8 h-8 text-slate-300 stroke-[1.5]" />
            <p className="text-xs font-semibold text-slate-700">No restaurants found</p>
            <p className="text-[11px] text-slate-400">Try adjusting your search terms or status filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 uppercase font-mono text-[10px]">
                <tr>
                  <th className="px-6 py-4 font-semibold">Restaurant</th>
                  <th className="px-6 py-4 font-semibold">Location</th>
                  <th className="px-6 py-4 font-semibold">Owner & FSSAI / GSTIN</th>
                  <th className="px-6 py-4 font-semibold">Approval Status</th>
                  <th className="px-6 py-4 text-right font-semibold">Super Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((r) => (
                  <tr 
                    key={r.id} 
                    onClick={() => setSelectedDetailId(r.id)}
                    className="hover:bg-blue-50/50 cursor-pointer transition-all group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <Store className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">{r.name}</p>
                          {r.description && (
                            <p className="text-[11px] text-slate-500 truncate max-w-xs mt-0.5">{r.description}</p>
                          )}
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
                      <p className="font-mono text-[11px] text-slate-700 font-semibold">Owner ID: {r.ownerId.slice(0, 13)}...</p>
                      {r.fssaiLicense && (
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">FSSAI: {r.fssaiLicense}</p>
                      )}
                      {r.gstin && (
                        <p className="text-[10px] text-slate-500 font-mono">GSTIN: {r.gstin}</p>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {r.status === 'ACTIVE' ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-600 font-semibold text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Active & Live
                        </span>
                      ) : r.status === 'PENDING_APPROVAL' ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/60 text-amber-700 font-semibold text-xs animate-pulse">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          Pending Approval
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-50 border border-red-200/60 text-red-600 font-semibold text-xs">
                          <XCircle className="w-3.5 h-3.5" />
                          Suspended
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        {r.status === 'PENDING_APPROVAL' ? (
                          <button
                            onClick={() => handleUpdateStatus(r.id, 'ACTIVE')}
                            disabled={actionBusyId === r.id}
                            className="px-4 py-1.5 rounded-full font-bold text-xs bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                          >
                            {actionBusyId === r.id ? 'Approving...' : 'Approve & Activate Store ✓'}
                          </button>
                        ) : r.status === 'ACTIVE' ? (
                          <button
                            onClick={() => handleUpdateStatus(r.id, 'SUSPENDED')}
                            disabled={actionBusyId === r.id}
                            className="px-3.5 py-1.5 rounded-full font-semibold text-xs bg-red-50 text-red-600 hover:bg-red-100 border border-red-200/60 transition-all cursor-pointer disabled:opacity-50"
                          >
                            {actionBusyId === r.id ? 'Updating...' : 'Suspend Listing'}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpdateStatus(r.id, 'ACTIVE')}
                            disabled={actionBusyId === r.id}
                            className="px-3.5 py-1.5 rounded-full font-semibold text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60 transition-all cursor-pointer disabled:opacity-50"
                          >
                            {actionBusyId === r.id ? 'Updating...' : 'Re-Activate Store'}
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteStore(r.id, r.name)}
                          disabled={actionBusyId === r.id}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer disabled:opacity-50"
                          title="Delete store listing permanently"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Restaurant Inspection Detail Modal */}
      <RestaurantDetailModal
        restaurantId={selectedDetailId}
        onClose={() => setSelectedDetailId(null)}
        onStatusChange={handleUpdateStatus}
        onDeleteStore={handleDeleteStore}
      />
    </div>
  );
}
