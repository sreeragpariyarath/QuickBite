'use client';

import { useState } from 'react';
import { ShoppingBag, Clock, CheckCircle2, AlertCircle, Search, Filter, DollarSign } from 'lucide-react';

const mockOrders = [
  {
    id: 'ORD-9021',
    restaurantName: 'Spice Garden Fine Dining',
    customerName: 'Priya Patel',
    total: '₹680',
    paymentMethod: 'COD',
    paymentStatus: 'PAID',
    status: 'DELIVERED',
    itemsCount: 3,
    time: '10m ago',
  },
  {
    id: 'ORD-9022',
    restaurantName: 'Urban Burger Club',
    customerName: 'Karan Sharma',
    total: '₹450',
    paymentMethod: 'COD',
    paymentStatus: 'PENDING',
    status: 'PREPARING',
    itemsCount: 2,
    time: '18m ago',
  },
  {
    id: 'ORD-9023',
    restaurantName: 'Spice Garden Fine Dining',
    customerName: 'Amit Shah',
    total: '₹1,240',
    paymentMethod: 'COD',
    paymentStatus: 'PENDING',
    status: 'ACCEPTED',
    itemsCount: 5,
    time: '25m ago',
  },
  {
    id: 'ORD-9024',
    restaurantName: 'Tandoori Nights',
    customerName: 'Rohan Mehra',
    total: '₹320',
    paymentMethod: 'COD',
    paymentStatus: 'PENDING',
    status: 'PENDING',
    itemsCount: 1,
    time: '3m ago',
  },
];

const statusColors: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-600 border-amber-200/60',
  ACCEPTED: 'bg-blue-50 text-blue-600 border-blue-200/60',
  PREPARING: 'bg-purple-50 text-purple-600 border-purple-200/60',
  DELIVERED: 'bg-emerald-50 text-emerald-600 border-emerald-200/60',
  REJECTED: 'bg-red-50 text-red-600 border-red-200/60',
  CANCELLED: 'bg-slate-100 text-slate-600 border-slate-200/60',
};

export default function LiveOrdersPage() {
  const [orders, setOrders] = useState(mockOrders);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.restaurantName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Live Orders Monitor</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time status tracking for customer orders across all active restaurants
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
            placeholder="Search by order ID, restaurant, customer..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200/80 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 bg-white border border-slate-200/80 px-3.5 py-2.5 rounded-2xl text-xs text-slate-600 shadow-sm">
          <Filter className="w-4 h-4 text-blue-600" />
          <span>Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent text-slate-900 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="ACCEPTED">ACCEPTED</option>
            <option value="PREPARING">PREPARING</option>
            <option value="DELIVERED">DELIVERED</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-100/90 rounded-[24px] overflow-hidden shadow-[0_8px_25px_rgba(0,0,0,0.025)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 uppercase font-mono text-[10px]">
              <tr>
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">Restaurant</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/60 transition-all">
                  <td className="px-6 py-4 font-mono font-bold text-blue-600">
                    {ord.id}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {ord.restaurantName}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {ord.customerName}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-slate-900">{ord.total}</span>
                    <span className="text-[10px] text-slate-400 font-mono block">{ord.paymentMethod} · {ord.paymentStatus}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-[11px] font-mono font-semibold ${
                        statusColors[ord.status] || statusColors.PENDING
                      }`}
                    >
                      {ord.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-400">
                    {ord.time}
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
