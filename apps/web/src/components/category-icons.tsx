import React from 'react';
import { Pizza, CupSoda, Cake, Salad, CookingPot, Utensils, Flame } from 'lucide-react';

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
