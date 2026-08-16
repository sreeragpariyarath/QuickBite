import { UserItem, UserRole } from '@/types';
import { SelectOption } from '@/components/ui';

export const MOCK_USERS: UserItem[] = [
  {
    id: '00000000-0000-0000-0000-000000000000',
    name: 'Super Admin',
    email: 'admin@quickbite.com',
    phone: '+919900000001',
    role: 'SUPER_ADMIN',
    isVerified: true,
    createdAt: '2026-06-01',
  },
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Rajesh Kumar (Owner)',
    email: 'rajesh@spicegarden.com',
    phone: '+919876543210',
    role: 'OWNER',
    isVerified: true,
    createdAt: '2026-06-15',
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Ananya Sharma (Manager)',
    email: 'ananya@spicegarden.com',
    phone: '+919876543211',
    role: 'MANAGER',
    isVerified: true,
    createdAt: '2026-07-02',
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Suresh V (Delivery)',
    email: null,
    phone: '+919876543212',
    role: 'DRIVER',
    isVerified: true,
    createdAt: '2026-07-10',
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    name: 'Priya Patel (Customer)',
    email: 'priya@example.com',
    phone: '+919876543213',
    role: 'CUSTOMER',
    isVerified: true,
    createdAt: '2026-07-18',
  },
];

export const ROLE_BADGE_COLORS: Record<UserRole, string> = {
  SUPER_ADMIN: 'bg-purple-50 text-purple-600 border-purple-200/60',
  OWNER: 'bg-emerald-50 text-emerald-600 border-emerald-200/60',
  MANAGER: 'bg-blue-50 text-blue-600 border-blue-200/60',
  CASHIER: 'bg-indigo-50 text-indigo-600 border-indigo-200/60',
  KITCHEN_STAFF: 'bg-amber-50 text-amber-600 border-amber-200/60',
  DRIVER: 'bg-teal-50 text-teal-600 border-teal-200/60',
  CUSTOMER: 'bg-slate-100 text-slate-600 border-slate-200/60',
};

export const USER_ROLE_OPTIONS: SelectOption[] = [
  { label: 'All Roles', value: 'ALL' },
  { label: 'Super Admin', value: 'SUPER_ADMIN' },
  { label: 'Store Owner', value: 'OWNER' },
  { label: 'Store Manager', value: 'MANAGER' },
  { label: 'Cashier', value: 'CASHIER' },
  { label: 'Kitchen Staff', value: 'KITCHEN_STAFF' },
  { label: 'Delivery Driver', value: 'DRIVER' },
  { label: 'Customer', value: 'CUSTOMER' },
];
