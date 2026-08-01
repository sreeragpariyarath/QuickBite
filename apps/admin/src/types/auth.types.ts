export type UserRole = 'CUSTOMER' | 'OWNER' | 'SUPER_ADMIN' | 'MANAGER' | 'CASHIER' | 'KITCHEN_STAFF' | 'DRIVER';

export interface AdminProfile {
  id: string;
  phone: string | null;
  email: string | null;
  isEmailVerified: boolean;
  name: string | null;
  role: UserRole;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user?: {
    id: string;
    email: string | null;
    name: string | null;
    role: UserRole;
  };
}
