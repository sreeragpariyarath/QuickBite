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

interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

function BenefitCard({ icon, title, description, className = '' }: BenefitCardProps) {
  return (
    <div className={`flex items-center gap-3.5 ${className}`}>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#335438]/5">
        {icon}
      </div>
      <div>
        <h4 className="text-xs font-bold text-zinc-900 tracking-tight">{title}</h4>
        <p className="text-[10px] font-medium text-zinc-500 mt-0.5">{description}</p>
      </div>
    </div>
  );
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
        <div className="relative overflow-hidden bg-gradient-to-br from-[#EBF2ED] to-[#F4FAF6] border border-[#335438]/10 rounded-3xl p-6 flex justify-between items-center group shadow-2xs hover:shadow-xs transition duration-300">
          <div className="space-y-3.5 z-10">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-[#335438] tracking-tight">Flat 50% OFF</h3>
              <p className="text-xs font-medium text-zinc-600">On your first order</p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-zinc-150 rounded-xl text-[10px] font-bold text-zinc-500 shadow-3xs">
              Use code: <span className="text-[#335438] font-bold bg-[#335438]/5 px-2 py-0.5 rounded-md">QUICK50</span>
            </div>
          </div>
          {/* Decorative Sparkles & Bowl Image */}
          <div className="absolute right-4 bottom-0 w-32 h-32 md:w-36 md:h-36 flex items-center justify-center shrink-0">
            {/* Sparkles */}
            <span className="absolute left-0 top-8 text-[9px] text-[#335438] animate-pulse">✦</span>
            <span className="absolute right-12 bottom-4 text-[9px] text-[#335438]">✦</span>
            <img 
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=250" 
              alt="Promo Salad Bowl" 
              className="w-22 h-22 md:w-26 md:h-26 object-cover rounded-full shadow-sm border-3 border-white/80 transform rotate-12 group-hover:rotate-45 transition-transform duration-700"
            />
          </div>
        </div>

        {/* Banner 2: Free Delivery */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#FAF5EC] to-[#FFFBF2] border border-[#d97706]/10 rounded-3xl p-6 flex justify-between items-center group shadow-2xs hover:shadow-xs transition duration-300">
          <div className="space-y-3.5 z-10">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-zinc-800 tracking-tight">Free Delivery</h3>
              <p className="text-xs font-medium text-zinc-600">On orders above ₹199</p>
            </div>
            <p className="text-[10px] font-bold text-amber-800 bg-amber-50/50 border border-amber-100/60 px-3 py-1 rounded-xl w-fit">
              No Coupon Required
            </p>
          </div>
          {/* Decorative Sparkles & Scooter Image */}
          <div className="absolute right-2 bottom-2 w-32 h-24 md:w-36 md:h-28 flex items-center justify-end shrink-0">
            {/* Sparkles */}
            <span className="absolute left-6 top-1 text-[9px] text-amber-500 animate-pulse">✦</span>
            <span className="absolute right-2 top-8 text-[9px] text-amber-500/40">✦</span>
            <img 
              src="https://images.unsplash.com/photo-1562920841-02824487651d?q=80&w=250" 
              alt="Free Delivery Scooter" 
              className="w-24 h-20 md:w-28 md:h-24 object-contain group-hover:translate-x-1 transition-transform duration-500"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
