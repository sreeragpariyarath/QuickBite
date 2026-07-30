'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { api, AUTH_URL, clearTokens, getAccessToken, storeTokens } from './api';
import type { Profile } from './types';

interface AuthContextValue {
  profile: Profile | null;
  loading: boolean;
  loginWithTokens: (accessToken: string, refreshToken: string) => Promise<Profile | null>;
  refreshProfile: () => Promise<Profile | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async (): Promise<Profile | null> => {
    if (!getAccessToken()) {
      setProfile(null);
      return null;
    }
    try {
      const data = await api<Profile>(AUTH_URL, '/auth/me', { auth: true });
      setProfile(data);
      return data;
    } catch {
      clearTokens();
      setProfile(null);
      return null;
    }
  }, []);

  useEffect(() => {
    refreshProfile().finally(() => setLoading(false));
  }, [refreshProfile]);

  const loginWithTokens = useCallback(
    async (accessToken: string, refreshToken: string): Promise<Profile | null> => {
      storeTokens(accessToken, refreshToken);
      return await refreshProfile();
    },
    [refreshProfile],
  );

  const logout = useCallback(() => {
    clearTokens();
    setProfile(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ profile, loading, loginWithTokens, refreshProfile, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
