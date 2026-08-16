import { UserRole } from './auth.types';

export interface UserItem {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  role: UserRole;
  isVerified: boolean;
  createdAt: string;
}
