import { Navigation, Loader2 } from 'lucide-react';

interface LocationDropdownProps {
  onClose: () => void;
  onGetCurrentLocation: () => void;
  officeAddress: string | null;
  homeAddress: string | null;
  onAddAddress: (type: 'Home' | 'Office') => void;
  onSelectAddress: (address: string) => void;
  suggestions: string[];
  isLoadingSuggestions: boolean;
}

export function LocationDropdown({
  onClose,
  onGetCurrentLocation,
  officeAddress,
  homeAddress,
  onAddAddress,
  onSelectAddress,
  suggestions,
  isLoadingSuggestions,
}: LocationDropdownProps) {
  return (
    <>
      {/* Backdrop overlay to close dropdown */}
      <div 
        className="fixed inset-0 z-40 bg-transparent" 
        onClick={onClose} 
      />
      
      <div className="absolute top-[calc(100%+12px)] left-0 bg-white border border-zinc-200/80 rounded-2xl shadow-xl p-4 w-96 z-50 space-y-4 text-sm animate-fade-in">
        
        {/* Current Location option */}
        <button 
          onClick={onGetCurrentLocation}
          className="w-full flex items-center gap-2.5 text-left font-bold text-[#335438] hover:bg-zinc-50 p-2 rounded-xl transition cursor-pointer focus:outline-none"
        >
          <Navigation className="h-4 w-4 fill-current text-[#335438] rotate-45 shrink-0" />
          <span>Use my current location</span>
        </button>

        <div className="border-t border-zinc-100 my-1" />

        {/* Saved Addresses list */}
        <div className="space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-2 select-none">
            Saved Addresses
          </p>

          {/* Office Address Container */}
          <div className="flex items-start gap-2.5 hover:bg-zinc-50 p-2 rounded-xl transition select-none">
            <Navigation className="h-4 w-4 text-zinc-400 shrink-0 mt-0.5 rotate-45" />
            <div className="flex-1">
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-zinc-800">Office</span>
                  <span className="text-zinc-300">·</span>
                  {!officeAddress && (
                    <button
                      onClick={() => onAddAddress('Office')}
                      className="text-[11px] font-bold text-zinc-400 italic hover:text-[#335438] cursor-pointer focus:outline-none"
                    >
                      Empty (Tap to add)
                    </button>
                  )}
                </div>
                {officeAddress && (
                  <button
                    onClick={() => onSelectAddress(officeAddress)}
                    className="text-[11px] text-zinc-500 text-left hover:text-[#335438] cursor-pointer mt-0.5 focus:outline-none"
                  >
                    {officeAddress}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Home Address Container */}
          <div className="flex items-start gap-2.5 hover:bg-zinc-50 p-2 rounded-xl transition select-none">
            <Navigation className="h-4 w-4 text-zinc-400 shrink-0 mt-0.5 rotate-45" />
            <div className="flex-1">
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-zinc-800">Home</span>
                  <span className="text-zinc-300">·</span>
                  {!homeAddress && (
                    <button
                      onClick={() => onAddAddress('Home')}
                      className="text-[11px] font-bold text-zinc-400 italic hover:text-[#335438] cursor-pointer focus:outline-none"
                    >
                      Empty (Tap to add)
                    </button>
                  )}
                </div>
                {homeAddress && (
                  <button
                    onClick={() => onSelectAddress(homeAddress)}
                    className="text-[11px] text-zinc-500 text-left hover:text-[#335438] cursor-pointer mt-0.5 focus:outline-none"
                  >
                    {homeAddress}
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Search Suggestions Section */}
        {(isLoadingSuggestions || suggestions.length > 0) && (
          <>
            <div className="border-t border-zinc-100 my-1" />
            <div className="space-y-3">
              <div className="flex items-center justify-between px-2 select-none">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Search Results
                </span>
                {isLoadingSuggestions && (
                  <Loader2 className="h-3.5 w-3.5 text-[#335438] animate-spin" />
                )}
              </div>

              <div className="max-h-48 overflow-y-auto space-y-1">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSelectAddress(suggestion)}
                    className="w-full flex items-start gap-2.5 hover:bg-zinc-50 p-2 rounded-xl text-left transition select-none cursor-pointer focus:outline-none"
                  >
                    <Navigation className="h-4 w-4 text-zinc-400 shrink-0 mt-0.5 rotate-45" />
                    <span className="text-xs text-zinc-600 line-clamp-2">{suggestion}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

      </div>
    </>
  );
}
