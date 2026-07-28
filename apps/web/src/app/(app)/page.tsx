'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { api, RESTAURANT_URL } from '@/lib/api';
import type { Restaurant, GlobalCategory } from '@/lib/types';
import { Hero } from '@/components/hero';

export default function HomePage() {
  const [restaurants, setRestaurants] = useState<Restaurant[] | null>(null);
  const [categories, setCategories] = useState<GlobalCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const restaurantGridRef = useRef<HTMLDivElement>(null);

  // Fetch all global categories on mount
  useEffect(() => {
    api<GlobalCategory[]>(RESTAURANT_URL, '/global-categories')
      .then(setCategories)
      .catch((e) => console.error('Failed to load categories:', e));
  }, []);

  // Fetch restaurants whenever selectedCategory updates
  useEffect(() => {
    setRestaurants(null);
    const path = selectedCategory
      ? `/restaurants?cuisine=${encodeURIComponent(selectedCategory)}`
      : '/restaurants';
    
    api<Restaurant[]>(RESTAURANT_URL, path)
      .then(setRestaurants)
      .catch((e) => setError(e.message));
  }, [selectedCategory]);

  const scrollToRestaurants = () => {
    restaurantGridRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (error) {
    return (
      <div className="py-12">
        <p className="text-red-600 font-bold bg-red-50 border border-red-100 rounded-2xl p-4 text-sm">
          Could not load restaurants: {error}. Are the backend microservices running?
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-16 ">
      {/* Hero Section */}
      <Hero
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onOrderNowClick={scrollToRestaurants}
      />

      {/* Restaurants Section */}
      <div ref={restaurantGridRef} className="scroll-mt-20 space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
              {selectedCategory ? `${selectedCategory} Restaurants` : 'Featured Restaurants'}
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              {selectedCategory
                ? `Showing restaurants serving delicious ${selectedCategory}`
                : 'Explore fresh and delicious options nearby'}
            </p>
          </div>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-xs font-bold text-[#335438] hover:underline focus:outline-none cursor-pointer"
            >
              Clear Filter
            </button>
          )}
        </div>

        {!restaurants ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse space-y-4">
                <div className="bg-zinc-100 aspect-video rounded-2xl" />
                <div className="h-4 bg-zinc-100 rounded w-2/3" />
                <div className="h-3 bg-zinc-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : restaurants.length === 0 ? (
          <div className="text-center py-12 bg-zinc-50/50 border border-zinc-100/60 rounded-3xl">
            <p className="text-zinc-500 font-medium text-sm">No restaurants found in this category.</p>
            <button
              onClick={() => setSelectedCategory(null)}
              className="mt-3 text-xs font-bold text-[#335438] hover:underline"
            >
              Show all restaurants
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {restaurants.map((r) => {
              // Generate realistic delivery time and rating details
              const deliveryTime = '20-30 min';
              const rating = (4.0 + (parseInt(r.id.slice(0, 2), 16) % 10) / 10).toFixed(1);

              return (
                <div
                  key={r.id}
                  className="group flex flex-col bg-white rounded-2xl border border-zinc-100/60 hover:border-zinc-200/80 shadow-2xs hover:shadow-xs overflow-hidden transition-all duration-200"
                >
                  {/* Restaurant Cover Image */}
                  <div className="relative aspect-video bg-zinc-50 overflow-hidden">
                    <img
                      src={r.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400'}
                      alt={r.name}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                      loading="lazy"
                    />
                    {/* Delivery Time Overlay Badge */}
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/75 backdrop-blur-xs rounded-lg text-[9px] font-bold text-white select-none">
                      {deliveryTime}
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h3 className="font-bold text-zinc-900 tracking-tight text-sm truncate group-hover:text-[#335438] transition-colors">
                        {r.name}
                      </h3>
                      
                      {/* Cuisines tag line */}
                      <p className="text-[11px] font-medium text-zinc-500 truncate mt-0.5">
                        {r.cuisines && r.cuisines.length > 0
                          ? r.cuisines.join(' · ')
                          : r.description || 'QuickBite Partner'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-bold border-t border-zinc-50 pt-2">
                      {/* Rating details */}
                      <div className="flex items-center gap-1 text-[#335438] select-none">
                        <Star className="h-3 w-3 fill-current" />
                        <span>{rating}</span>
                      </div>

                      {/* City/Location */}
                      <span className="text-zinc-400 font-bold truncate max-w-[100px]">
                        {r.city}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
