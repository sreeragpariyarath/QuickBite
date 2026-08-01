export const AUTH_SERVICE_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost:3000';
export const RESTAURANT_SERVICE_URL = process.env.NEXT_PUBLIC_RESTAURANT_SERVICE_URL || 'http://localhost:3001';
export const ORDER_SERVICE_URL = process.env.NEXT_PUBLIC_ORDER_SERVICE_URL || 'http://localhost:3002';

export const API_ENDPOINTS = {
  LOGIN: '/auth/login/email',
  VERIFY_OTP: '/auth/otp/verify',
  REFRESH_TOKEN: '/auth/refresh',
  PROFILE_ME: '/auth/me',
  LOGOUT: '/auth/logout',
  RESTAURANTS: '/restaurants',
  ORDERS: '/orders',
} as const;
