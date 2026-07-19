'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, RESTAURANT_URL } from '@/lib/api';
import type { Restaurant } from '@/lib/types';

export default function HomePage() {
  const [restaurants, setRestaurants] = useState<Restaurant[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<Restaurant[]>(RESTAURANT_URL, '/restaurants')
      .then(setRestaurants)
      .catch((e) => setError(e.message));
  }, []);

  if (error)
    return (
      <p className="text-red-600">
        Could not load restaurants: {error}. Are the services running?
      </p>
    );
  if (!restaurants) return <p className="text-zinc-500">Loading…</p>;
  if (restaurants.length === 0)
    return <p className="text-zinc-500">No restaurants yet — check back soon.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Restaurants</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {restaurants.map((r) => (
          <Link
            key={r.id}
            href={`/r/${r.id}`}
            className="bg-white rounded-lg border border-zinc-200 p-4 hover:border-teal-400 hover:shadow-sm transition"
          >
            <h2 className="font-semibold text-lg">{r.name}</h2>
            {r.description && (
              <p className="text-sm text-zinc-600 mt-1">{r.description}</p>
            )}
            <p className="text-sm text-zinc-500 mt-2">
              {r.address} · {r.city}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
