'use client';

import { useState } from 'react';
import { LayoutGrid, X, Zap, Award, ShieldCheck, Bike } from 'lucide-react';
import type { GlobalCategory } from '@/lib/types';
import { BenefitCard } from './benefit-card';
import { SparkleSVG } from './sparkle-svg';
import { getCategoryIcon } from './category-icons';

interface HeroProps {
  categories: GlobalCategory[];
  selectedCategory: string | null;
  onSelectCategory: (categoryName: string | null) => void;
  onOrderNowClick: () => void;
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
        <BenefitCard
          icon={<Zap className="h-4.5 w-4.5 text-[#335438]" />}
          title="Fast Delivery"
          description="On-time, every time"
        />
        <BenefitCard
          icon={<Award className="h-4.5 w-4.5 text-[#335438]" />}
          title="Top Restaurants"
          description="Handpicked for you"
          className="sm:border-l border-zinc-200/60 sm:pl-6"
        />
        <BenefitCard
          icon={<ShieldCheck className="h-4.5 w-4.5 text-[#335438]" />}
          title="Safe & Secure"
          description="Your data is protected"
          className="lg:border-l border-zinc-200/60 lg:pl-6"
        />
        <BenefitCard
          icon={<Bike className="h-4.5 w-4.5 text-[#335438]" />}
          title="Live Tracking"
          description="Track your order real-time"
          className="sm:border-l border-zinc-200/60 sm:pl-6"
        />
      </div>

      {/* Promo & Offer Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 select-none">
        
        {/* Banner 1: Flat 50% OFF */}
        <div className="relative overflow-hidden bg-[#EEF4F0] border border-[#335438]/5 rounded-3xl p-6 md:p-7 flex justify-between items-center group shadow-2xs hover:shadow-xs transition duration-300 min-h-[140px]">
          <div className="space-y-4.5 z-10">
            <div className="space-y-0.5">
              <h3 className="text-lg md:text-xl font-bold text-[#2B4E32] tracking-tight">Flat 50% OFF</h3>
              <p className="text-xs font-semibold text-[#5C7E63]">On your first order</p>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-semibold text-[#5C7E63]">
              <span>Use code:</span>
              <span className="bg-white px-3 py-1.5 rounded-xl shadow-2xs text-[10px] font-bold text-[#2B4E32] tracking-wider select-all">
                QUICK50
              </span>
            </div>
          </div>
          
          {/* Overlapping Salad Plate */}
          <div className="absolute right-[-12%] top-1/2 -translate-y-1/2 h-[125%] aspect-square rounded-full bg-white shadow-md flex items-center justify-center p-2 z-0">
            <img 
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=250" 
              alt="Flat 50% OFF Salad Bowl" 
              className="w-full h-full object-cover rounded-full transform rotate-12 group-hover:rotate-45 transition-transform duration-700"
            />
          </div>

          {/* Green Sparkles */}
          <SparkleSVG className="absolute right-[43%] top-5 w-3 h-3 text-[#2B4E32]/75 animate-pulse" />
          <SparkleSVG className="absolute right-[45%] bottom-8 w-2.5 h-2.5 text-[#2B4E32]/50" />
          <SparkleSVG className="absolute right-[33%] top-14 w-2 h-2 text-[#2B4E32]/35" />
        </div>

        {/* Banner 2: Free Delivery */}
        <div className="relative overflow-hidden bg-[#FAF5EC] border border-amber-900/5 rounded-3xl p-6 md:p-7 flex justify-between items-center group shadow-2xs hover:shadow-xs transition duration-300 min-h-[140px]">
          <div className="space-y-1 z-10">
            <h3 className="text-lg md:text-xl font-bold text-zinc-800 tracking-tight">Free Delivery</h3>
            <p className="text-xs font-semibold text-zinc-500">On orders above ₹199</p>
          </div>
          
          {/* Delivery Scooter Illustration */}
          <div className="absolute right-3 bottom-0 w-32 h-[85%] md:w-36 flex items-end justify-end z-0">
            <img 
              src="https://images.unsplash.com/photo-1562920841-02824487651d?q=80&w=250" 
              alt="Free Delivery Scooter" 
              className="w-24 h-20 md:w-28 md:h-24 object-contain group-hover:translate-x-2 transition-transform duration-500 filter drop-shadow-sm"
            />
          </div>

          {/* Yellow/Gold Sparkles */}
          <SparkleSVG className="absolute right-[36%] top-6 w-3 h-3 text-amber-500 animate-pulse" />
          <SparkleSVG className="absolute right-[40%] bottom-10 w-2.5 h-2.5 text-amber-500/50" />
          <SparkleSVG className="absolute right-[30%] bottom-5 w-2 h-2 text-amber-500/30" />
        </div>

      </div>
    </section>
  );
}
