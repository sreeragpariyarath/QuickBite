'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AUTH_SERVICE_URL } from '@/constants';
import { setAuthToken, clearAuthToken, getAuthToken, getStoredUser } from '@/lib/api';
import { request } from '@/lib/api-client';
import type { AdminProfile, AuthResponse, UserRole } from '@/types';

interface AuthContextValue {
  profile: AdminProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync profile state on mount from server or local storage
  const fetchProfile = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      const data = await request<AdminProfile>(AUTH_SERVICE_URL, '/auth/me', {
        auth: true,
      });
      setProfile(data);
    } catch {
      // In case token expires, clear and signout
      clearAuthToken();
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Handle credentials login submit
  const login = async (email: string, password: string) => {
    try {
      const res = await request<AuthResponse>(AUTH_SERVICE_URL, '/auth/login/email', {
        method: 'POST',
        body: { email, password },
      });

      if (!res.accessToken) {
        throw new Error('No access token received from authentication server.');
      }

      setAuthToken(res.accessToken);

      // Verify the role immediately, must be owner or super_admin
      const data = await request<AdminProfile>(AUTH_SERVICE_URL, '/auth/me', {
        auth: true,
      });

      const allowedRoles: UserRole[] = ['SUPER_ADMIN', 'OWNER', 'MANAGER'];
      if (!allowedRoles.includes(data.role)) {
        clearAuthToken();
        throw new Error('Access denied. This dashboard is reserved for authorized restaurant partners/owners.');
      }

      setProfile(data);
      localStorage.setItem('qb_admin_user', JSON.stringify(data));
      router.push('/dashboard');
    } catch (err) {
      throw err;
    }
  };

  const logout = useCallback(() => {
    clearAuthToken();
    setProfile(null);
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider value={{ profile, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside an AuthProvider context wrapper');
  }
  return ctx;
}
