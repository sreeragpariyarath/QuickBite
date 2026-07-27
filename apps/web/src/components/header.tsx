'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MapPin, ChevronDown, Search, ShoppingBag, User, X } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useLocation } from '@/hooks/use-location';
import { LocationDropdown } from './location-dropdown';

export function Header() {
  const { profile, loading, logout } = useAuth();
  const router = useRouter();

  // Location selector hook managing Spatial LRU caching & browser geocoding
  const {
    isDropdownOpen,
    setIsDropdownOpen,
    selectedLocation,
    officeAddress,
    homeAddress,
    suggestions,
    isLoadingSuggestions,
    errorMessage,
    setErrorMessage,
    handleInputChange,
    handleGetCurrentLocation,
    handleAddAddress,
    handleSelectAddress,
  } = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/60 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left Side: Logo & Location dropdown */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8.5 w-8.5 items-center justify-center rounded-xl bg-[#335438] text-sm font-black text-white select-none">
              QB
            </span>
            <span className="text-lg font-black text-zinc-900 tracking-tight">
              Quick<span className="text-[#335438]">Bite</span>
            </span>
          </Link>
          
          {/* Location Selector Wrapper (Swiggy-style Input Box) */}
          <div className="relative hidden sm:block">
            <div 
              className="flex items-center justify-between gap-2.5 h-10 w-64 px-3.5 bg-white border border-zinc-200/80 hover:border-zinc-300 focus-within:border-[#335438] focus-within:ring-2 focus-within:ring-[#335438]/10 rounded-xl shadow-xs transition"
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <MapPin className="h-4 w-4 text-[#335438] shrink-0" />
                <input
                  type="text"
                  value={selectedLocation}
                  placeholder="Enter your delivery location"
                  onChange={(e) => handleInputChange(e.target.value)}
                  onFocus={() => setIsDropdownOpen(true)}
                  className="text-xs font-bold text-zinc-700 bg-transparent border-none outline-none w-full placeholder:text-zinc-400 focus:ring-0 p-0"
                />
                {selectedLocation && (
                  <button
                    onClick={() => handleInputChange('')}
                    className="p-0.5 text-zinc-400 hover:text-zinc-600 transition focus:outline-none shrink-0"
                  >
                    <X className="h-3.5 w-3.5 stroke-[2.5]" />
                  </button>
                )}
              </div>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="focus:outline-none shrink-0"
              >
                <ChevronDown className={`h-4 w-4 text-zinc-400 shrink-0 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Location Dropdown Modal */}
            {isDropdownOpen && (
              <LocationDropdown
                onClose={() => setIsDropdownOpen(false)}
                onGetCurrentLocation={handleGetCurrentLocation}
                officeAddress={officeAddress}
                homeAddress={homeAddress}
                onAddAddress={handleAddAddress}
                onSelectAddress={handleSelectAddress}
                suggestions={suggestions}
                isLoadingSuggestions={isLoadingSuggestions}
              />
            )}
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-6 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search for restaurants, cuisines or dishes..."
            className="w-full bg-zinc-50 border border-zinc-200/80 rounded-xl py-2 pl-10 pr-4 text-xs font-medium text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#335438]/10 focus:border-[#335438] transition-all"
          />
        </div>

        {/* Right Side: Cart Icon & User Menu */}
        <div className="flex items-center gap-3">
          {/* Static Cart Button */}
          <button className="relative p-2 text-zinc-700 hover:text-[#335438] transition cursor-pointer select-none focus:outline-none">
            <ShoppingBag className="h-5.5 w-5.5 stroke-[2]" />
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#335438] text-[9px] font-black text-white">
              2
            </span>
          </button>

          {/* User auth options */}
          {loading ? null : profile ? (
            <div className="flex items-center gap-3">
              <Link href="/orders" className="hidden sm:inline text-xs font-bold text-zinc-600 hover:text-[#335438] transition">
                My Orders
              </Link>
              <button
                onClick={() => {
                  logout();
                  router.push('/');
                }}
                className="hidden sm:inline text-xs font-bold text-zinc-500 hover:text-[#335438] transition cursor-pointer"
              >
                Logout
              </button>
              <div className="h-8.5 w-8.5 rounded-full bg-[#F2F3E9] flex items-center justify-center font-black text-[#335438] text-xs border border-[#335438]/5 select-none shadow-sm shadow-zinc-200/50">
                {profile.name ? profile.name.slice(0, 2).toUpperCase() : 'U'}
              </div>
            </div>
          ) : (
            <Link href="/login" className="p-2 text-zinc-700 hover:text-[#335438] transition cursor-pointer focus:outline-none">
              <User className="h-5.5 w-5.5 stroke-[2]" />
            </Link>
          )}
        </div>

      </div>

      {/* Floating Geolocation Error Toast Notification */}
      {errorMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#335438] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold border border-white/10 select-none animate-fade-in">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-white leading-none">
            ⚠️
          </span>
          <span className="max-w-xs">{errorMessage}</span>
          <button 
            onClick={() => setErrorMessage(null)} 
            className="ml-2 hover:opacity-85 focus:outline-none cursor-pointer shrink-0"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </header>
  );
}
