'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDebounce } from './use-debounce';

interface CacheEntry {
  lat: number;
  lon: number;
  address: string;
  timestamp: number;
}

/**
 * Spatial Proximity LRU Cache (DSA Optimization)
 * Uses the Haversine formula to compute exact distance over Earth's curvature.
 * Prevents repeat API queries for locations within a 50-meter threshold.
 */
class GeocodeCache {
  private cache: CacheEntry[] = [];
  private maxEntries = 20;
  private distanceThreshold = 50; // Distance threshold in meters

  /**
   * Calculates Haversine distance in meters between two lat/lon pairs
   */
  private calculateHaversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371e3; // Earth's radius in meters
    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;
    const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) *
        Math.cos(phi2) *
        Math.sin(deltaLambda / 2) *
        Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }

  get(lat: number, lon: number): string | null {
    const now = Date.now();
    // Evict cache entries older than 10 minutes
    this.cache = this.cache.filter((entry) => now - entry.timestamp < 10 * 60 * 1000);

    const hit = this.cache.find((entry) => {
      const distance = this.calculateHaversineDistance(entry.lat, entry.lon, lat, lon);
      return distance < this.distanceThreshold;
    });

    if (hit) {
      // Shift hit to head (LRU behavior)
      this.cache = [hit, ...this.cache.filter((e) => e !== hit)];
      return hit.address;
    }
    return null;
  }

  set(lat: number, lon: number, address: string) {
    const entry: CacheEntry = { lat, lon, address, timestamp: Date.now() };
    this.cache = [
      entry,
      ...this.cache.filter((e) => e.lat !== lat || e.lon !== lon),
    ].slice(0, this.maxEntries);
  }
}

const spatialCache = new GeocodeCache();

export function useLocation() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [officeAddress, setOfficeAddress] = useState<string | null>(null);
  const [homeAddress, setHomeAddress] = useState<string | null>(null);

  // Autocomplete suggestions states
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Custom toast notification errors
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const debouncedQuery = useDebounce(selectedLocation, 400);

  // Auto-dismiss error message toast after 4 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // Autocomplete Suggestions Fetcher Effect
  useEffect(() => {
    if (!isTyping || !debouncedQuery || debouncedQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setIsLoadingSuggestions(true);
      try {
        const res = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(debouncedQuery)}&limit=5&lang=en`,
          {
            headers: {
              'User-Agent': 'QuickBite-Web-App',
            },
          }
        );
        const data = await res.json();

        if (data && Array.isArray(data.features)) {
          const results: string[] = data.features
            .filter((feat: any) => feat.properties.country?.toLowerCase() === 'india')
            .map((feat: any): string => {
              const p = feat.properties;
              const rawSegments = [
                p.name,
                p.district || p.locality || p.suburb || p.neighbourhood,
                p.city || p.town || p.village,
                p.state,
              ];
              
              const seen = new Set<string>();
              const cleanSegments: string[] = [];
              
              for (const segment of rawSegments) {
                if (!segment) continue;
                const normalized = segment.trim().toLowerCase();
                if (!seen.has(normalized)) {
                  seen.add(normalized);
                  cleanSegments.push(segment.trim());
                }
              }
              
              return cleanSegments.join(', ');
            })
            .filter(Boolean);

          setSuggestions([...new Set(results)]);
        } else {
          setSuggestions([]);
        }
      } catch {
        setSuggestions([]);
      } finally {
        setIsLoadingSuggestions(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery, isTyping]);

  const handleGetCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your browser.');
      setSelectedLocation('');
      setIsTyping(false);
      return;
    }

    setSelectedLocation('Detecting location...');
    setIsDropdownOpen(false);
    setIsTyping(false);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        // Check spatial cache (DSA memoization hit check)
        const cachedAddress = spatialCache.get(lat, lon);
        if (cachedAddress) {
          setSelectedLocation(cachedAddress);
          return;
        }

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=en`,
            {
              headers: {
                'User-Agent': 'QuickBite-Web-App',
              },
            }
          );
          const data = await res.json();
          if (data.display_name) {
            const parts = data.display_name.split(',');
            const detailedAddr = parts
              .slice(0, 4)
              .map((p: string) => p.trim())
              .join(', ');

            spatialCache.set(lat, lon, detailedAddr);
            setSelectedLocation(detailedAddr);
          } else {
            setSelectedLocation('');
          }
        } catch {
          setSelectedLocation('');
        }
      },
      (error) => {
        let msg = 'An error occurred while fetching your location.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location access denied. Please enable location permissions in your browser.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Location unavailable. Please check your GPS signal.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Location request timed out. Please try again.';
        }
        setErrorMessage(msg);
        setSelectedLocation('');
      }
    );
  }, []);

  const handleInputChange = useCallback((value: string) => {
    setSelectedLocation(value);
    setIsTyping(true);
  }, []);

  const handleAddAddress = useCallback((type: 'Home' | 'Office') => {
    const addr = prompt(`Enter delivery address for ${type}:`);
    if (addr) {
      if (type === 'Home') setHomeAddress(addr);
      else setOfficeAddress(addr);
    }
  }, []);

  const handleSelectAddress = useCallback((address: string) => {
    setSelectedLocation(address);
    setIsDropdownOpen(false);
    setIsTyping(false);
    setSuggestions([]);
  }, []);

  return {
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
  };
}
