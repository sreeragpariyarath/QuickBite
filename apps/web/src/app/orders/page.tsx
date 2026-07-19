'use client';

import { useEffect, useState } from 'react';
import { api, ORDER_URL } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import type { Order } from '@/lib/types';

const STATUS_STYLES: Record<Order['status'], string> = {
  PENDING: 'bg-amber-100 text-amber-800',
  ACCEPTED: 'bg-blue-100 text-blue-800',
  PREPARING: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-zinc-200 text-zinc-600',
};

export default function OrdersPage() {
  const { profile, loading } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && profile) {
      api<Order[]>(ORDER_URL, '/orders', { auth: true })
        .then(setOrders)
        .catch((e) => setError(e.message));
    }
  }, [loading, profile]);

  if (loading) return <p className="text-zinc-500">Loading…</p>;
  if (!profile)
    return <p className="text-zinc-500">Login to see your orders.</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!orders) return <p className="text-zinc-500">Loading orders…</p>;
  if (orders.length === 0)
    return <p className="text-zinc-500">No orders yet — go grab something!</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-lg border border-zinc-200 p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-xs font-semibold px-2 py-1 rounded ${STATUS_STYLES[order.status]}`}
              >
                {order.status}
              </span>
              <span className="text-sm text-zinc-500">
                {new Date(order.createdAt).toLocaleString()}
              </span>
            </div>
            <ul className="text-sm text-zinc-700">
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.quantity} × {item.name}
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-100">
              <span className="text-xs text-zinc-500">
                {order.paymentMethod} ·{' '}
                {order.paymentStatus === 'PAID' ? 'Paid' : 'Pay on delivery'}
              </span>
              <span className="font-semibold">
                ₹{Number(order.total).toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
