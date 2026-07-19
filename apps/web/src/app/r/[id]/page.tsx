'use client';

import { use, useEffect, useState } from 'react';
import { api, RESTAURANT_URL } from '@/lib/api';
import type { MenuItem, RestaurantDetail } from '@/lib/types';

function MenuItemRow({ item }: { item: MenuItem }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-zinc-100 last:border-0">
      <div>
        <p className="font-medium">{item.name}</p>
        {item.description && (
          <p className="text-sm text-zinc-500">{item.description}</p>
        )}
      </div>
      <span className="font-semibold whitespace-nowrap ml-4">
        ₹{Number(item.price).toFixed(2)}
      </span>
    </div>
  );
}

export default function RestaurantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [restaurant, setRestaurant] = useState<RestaurantDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<RestaurantDetail>(RESTAURANT_URL, `/restaurants/${id}`)
      .then(setRestaurant)
      .catch((e) => setError(e.message));
  }, [id]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!restaurant) return <p className="text-zinc-500">Loading…</p>;

  const sections = [
    ...restaurant.categories.filter((c) => c.menuItems.length > 0),
    ...(restaurant.menuItems.length > 0
      ? [{ id: 'uncategorized', name: 'Other items', menuItems: restaurant.menuItems }]
      : []),
  ];

  return (
    <div>
      <div className="bg-white rounded-lg border border-zinc-200 p-5 mb-6">
        <h1 className="text-2xl font-bold">{restaurant.name}</h1>
        {restaurant.description && (
          <p className="text-zinc-600 mt-1">{restaurant.description}</p>
        )}
        <p className="text-sm text-zinc-500 mt-2">
          {restaurant.address} · {restaurant.city}
        </p>
      </div>

      {sections.length === 0 ? (
        <p className="text-zinc-500">This restaurant has no menu yet.</p>
      ) : (
        sections.map((section) => (
          <section key={section.id} className="mb-6">
            <h2 className="font-semibold text-lg mb-2">{section.name}</h2>
            <div className="bg-white rounded-lg border border-zinc-200 px-4">
              {section.menuItems.map((item) => (
                <MenuItemRow key={item.id} item={item} />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
