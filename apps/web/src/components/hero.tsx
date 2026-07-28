'use client';

import { useState } from 'react';
import { Pizza, CupSoda, Cake, Salad, CookingPot, Utensils, LayoutGrid, Flame, X, Zap, Award, ShieldCheck, Bike } from 'lucide-react';
import type { GlobalCategory } from '@/lib/types';

interface HeroProps {
  categories: GlobalCategory[];
  selectedCategory: string | null;
  onSelectCategory: (categoryName: string | null) => void;
  onOrderNowClick: () => void;
}

export function getCategoryIcon(name: string) {
  switch (name.toLowerCase()) {
    case 'burgers':
      return (
        <svg className="w-8 h-8 text-[#335438]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 11c0-3.3 2.7-6 6-6h6c3.3 0 6 2.7 6 6M3 11h18M3 11v2c0 2.2 1.8 4 4 4h10c2.2 0 4-1.8 4-4v-2M5 17h14c0 1.7-1.3 3-3 3H8c-1.7 0-3-1.3-3-3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case 'pizza':
      return <Pizza className="w-8 h-8 text-[#335438]" />;
    case 'beverages':
      return <CupSoda className="w-8 h-8 text-[#335438]" />;
    case 'desserts':
      return <Cake className="w-8 h-8 text-[#335438]" />;
    case 'indian':
      return <CookingPot className="w-8 h-8 text-[#335438]" />;
    case 'healthy':
      return <Salad className="w-8 h-8 text-[#335438]" />;
    case 'street food':
      return <Flame className="w-8 h-8 text-[#335438]" />;
    default:
      return <Utensils className="w-8 h-8 text-[#335438]" />;
  }
}

export function Hero({
  categories,
  selectedCategory,
  onSelectCategory,
  onOrderNowClick,
}: HeroProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Take first 5 categories for the hero grid
  const primaryCategories = categories.slice(0, 5);

  const handleCategoryClick = (name: string) => {
    if (selectedCategory === name) {
      onSelectCategory(null); // Clear filter
    } else {
      onSelectCategory(name);
    }
    setIsModalOpen(false);
  };

  return (
    <section className="py-12 md:py-16">
      <div className="grid gap-8 lg:grid-cols-12 items-center">
        
        {/* Left Column: Heading & Paragraph Description */}
        <div className="lg:col-span-5 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight leading-tight">
            Delicious food,<br />
            <span className="text-[#335438]">delivered fast</span><br />
            to your door.
          </h1>
          <p className="text-zinc-600 text-sm md:text-base max-w-md leading-relaxed">
            Order from top restaurants near you and enjoy your favorite meals fresh, fast, and delivered with care.
          </p>
          <div>
            <button
              onClick={onOrderNowClick}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#335438] hover:bg-[#28422c] text-white font-bold text-sm rounded-2xl shadow-sm transition-all hover:shadow-md cursor-pointer select-none"
            >
              Order Now
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right Column: Category list bubble grid */}
        <div className="lg:col-span-7 space-y-5 ">
          <h2 className="text-base font-bold text-zinc-800 tracking-tight">
            What's on your mind?
          </h2>
          
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {primaryCategories.map((cat) => {
              const isSelected = selectedCategory === cat.name;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.name)}
                  className={`flex flex-col items-center justify-center gap-3 p-4 bg-white border rounded-2xl aspect-square transition shadow-2xs hover:shadow-xs cursor-pointer select-none focus:outline-none ${
                    isSelected
                      ? 'border-2 border-[#335438] bg-[#F2F3E9] scale-[1.03]'
                      : 'border-zinc-200/60 hover:border-zinc-300'
                  }`}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-50 border border-zinc-100/50">
                    {getCategoryIcon(cat.name)}
                  </div>
                  <span className="text-[10px] font-bold text-zinc-800 tracking-tight truncate max-w-full">
                    {cat.name}
                  </span>
                </button>
              );
            })}

            {/* "More" Trigger Button */}
            {categories.length > 5 && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex flex-col items-center justify-center gap-3 p-4 bg-white border border-zinc-200/60 rounded-2xl aspect-square transition shadow-2xs hover:shadow-xs cursor-pointer select-none focus:outline-none hover:border-[#335438]/45"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-50 border border-zinc-100/50">
                  <LayoutGrid className="w-6 h-6 text-[#335438]" />
                </div>
                <span className="text-[10px] font-bold text-zinc-800 tracking-tight">
                  More
                </span>
              </button>
            )}
          </div>
        </div>

      </div>

      {/* "More Cuisines" Expanded Overlay Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative border border-zinc-100 animate-scale-in">
            
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-zinc-600 transition focus:outline-none cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-zinc-900 tracking-tight mb-5">
              What's on your mind?
            </h3>

            <div className="grid grid-cols-3 gap-3.5 max-h-[350px] overflow-y-auto pr-1">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.name;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.name)}
                    className={`flex flex-col items-center justify-center gap-3 p-3.5 bg-white border rounded-2xl aspect-square transition cursor-pointer select-none focus:outline-none ${
                      isSelected
                        ? 'border-2 border-[#335438] bg-[#F2F3E9]'
                        : 'border-zinc-200/60 hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-50 border border-zinc-100/50">
                      {getCategoryIcon(cat.name)}
                    </div>
                    <span className="text-[10px] font-bold text-zinc-800 tracking-tight truncate max-w-full">
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </div>

          </div>
        </div>
      )}

      {/* Trust Benefits Bar */}
      <div className="mt-10 bg-white border border-zinc-200/50 rounded-3xl p-5 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 select-none">
        
        {/* Card 1: Fast Delivery */}
        <div className="flex items-center gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#335438]/5">
            <Zap className="h-4.5 w-4.5 text-[#335438]" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-900 tracking-tight">Fast Delivery</h4>
            <p className="text-[10px] font-medium text-zinc-500 mt-0.5">On-time, every time</p>
          </div>
        </div>

        {/* Card 2: Top Restaurants */}
        <div className="flex items-center gap-3.5 sm:border-l border-zinc-200/60 sm:pl-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#335438]/5">
            <Award className="h-4.5 w-4.5 text-[#335438]" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-900 tracking-tight">Top Restaurants</h4>
            <p className="text-[10px] font-medium text-zinc-500 mt-0.5">Handpicked for you</p>
          </div>
        </div>

        {/* Card 3: Safe & Secure */}
        <div className="flex items-center gap-3.5 lg:border-l border-zinc-200/60 lg:pl-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#335438]/5">
            <ShieldCheck className="h-4.5 w-4.5 text-[#335438]" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-900 tracking-tight">Safe & Secure</h4>
            <p className="text-[10px] font-medium text-zinc-500 mt-0.5">Your data is protected</p>
          </div>
        </div>

        {/* Card 4: Live Tracking */}
        <div className="flex items-center gap-3.5 sm:border-l border-zinc-200/60 sm:pl-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#335438]/5">
            <Bike className="h-4.5 w-4.5 text-[#335438]" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-900 tracking-tight">Live Tracking</h4>
            <p className="text-[10px] font-medium text-zinc-500 mt-0.5">Track your order real-time</p>
          </div>
        </div>

      </div>
    </section>
  );
}
