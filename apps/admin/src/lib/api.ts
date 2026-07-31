export const AUTH_SERVICE_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost:3000';
export const RESTAURANT_SERVICE_URL = process.env.NEXT_PUBLIC_RESTAURANT_SERVICE_URL || 'http://localhost:3001';
export const ORDER_SERVICE_URL = process.env.NEXT_PUBLIC_ORDER_SERVICE_URL || 'http://localhost:3002';

export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('qb_admin_token');
  }
  return null;
}

export function setAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('qb_admin_token', token);
  }
}

export function clearAuthToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('qb_admin_token');
    localStorage.removeItem('qb_admin_user');
  }
}

export function getStoredUser(): any | null {
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem('qb_admin_user');
    return raw ? JSON.parse(raw) : null;
  }
  return null;
}
