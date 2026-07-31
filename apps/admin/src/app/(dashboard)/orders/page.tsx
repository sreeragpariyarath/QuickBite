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
  PENDING: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  ACCEPTED: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  PREPARING: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  DELIVERED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  REJECTED: 'bg-red-500/10 text-red-400 border-red-500/30',
  CANCELLED: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-800/60">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Live Orders Monitor</h1>
          <p className="text-xs text-gray-400 mt-1">
            Real-time status tracking for customer orders across all active restaurants
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
            placeholder="Search by order ID, restaurant, customer..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#111827] border border-gray-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 bg-[#111827] border border-gray-800 px-3 py-2 rounded-xl text-xs text-gray-400">
          <Filter className="w-4 h-4 text-emerald-400" />
          <span>Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent text-white focus:outline-none cursor-pointer"
          >
            <option value="ALL" className="bg-[#111827]">All Statuses</option>
            <option value="PENDING" className="bg-[#111827]">PENDING</option>
            <option value="ACCEPTED" className="bg-[#111827]">ACCEPTED</option>
            <option value="PREPARING" className="bg-[#111827]">PREPARING</option>
            <option value="DELIVERED" className="bg-[#111827]">DELIVERED</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#111827]/80 border border-gray-800/80 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#162032] border-b border-gray-800 text-gray-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Restaurant</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 text-gray-300">
              {filtered.map((ord) => (
                <tr key={ord.id} className="hover:bg-gray-800/30 transition-all">
                  <td className="px-6 py-4 font-mono font-bold text-emerald-400">
                    {ord.id}
                  </td>
                  <td className="px-6 py-4 font-medium text-white">
                    {ord.restaurantName}
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {ord.customerName}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-white">{ord.total}</span>
                    <span className="text-[10px] text-gray-500 font-mono block">{ord.paymentMethod} · {ord.paymentStatus}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-mono font-semibold ${
                        statusColors[ord.status] || statusColors.PENDING
                      }`}
                    >
                      {ord.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-gray-500">
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
