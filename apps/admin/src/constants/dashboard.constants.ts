import { Users, Store, ShoppingBag, TrendingUp } from 'lucide-react';
import { KpiStatItem, MicroserviceHealthItem, ActivityEventItem } from '@/types';

export const DASHBOARD_STATS: KpiStatItem[] = [
  {
    id: 'kpi-users',
    title: 'Total Platform Users',
    value: '1,420',
    change: '+12.4%',
    icon: Users,
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    badgeBg: 'bg-blue-50 text-blue-600',
  },
  {
    id: 'kpi-restaurants',
    title: 'Active Restaurants',
    value: '84',
    change: '+6.2%',
    icon: Store,
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600',
    badgeBg: 'bg-purple-50 text-purple-600',
  },
  {
    id: 'kpi-orders',
    title: 'Total Orders Processed',
    value: '3,890',
    change: '+18.1%',
    icon: ShoppingBag,
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    badgeBg: 'bg-emerald-50 text-emerald-600',
  },
  {
    id: 'kpi-revenue',
    title: 'Gross Platform Revenue',
    value: '₹4,82,900',
    change: '+24.5%',
    icon: TrendingUp,
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-600',
    badgeBg: 'bg-amber-50 text-amber-600',
  },
];

export const MICROSERVICES_HEALTH: MicroserviceHealthItem[] = [
  { id: 'svc-auth', name: 'auth-service', port: 3000, status: 'Healthy', db: 'auth_db', uptime: '99.98%' },
  { id: 'svc-restaurant', name: 'restaurant-service', port: 3001, status: 'Healthy', db: 'restaurant_db', uptime: '99.95%' },
  { id: 'svc-order', name: 'order-service', port: 3002, status: 'Healthy', db: 'order_db', uptime: '99.99%' },
  { id: 'svc-notification', name: 'notification-service', port: 3003, status: 'Standby', db: 'Event-driven', uptime: '100%' },
];

export const RECENT_PLATFORM_EVENTS: ActivityEventItem[] = [
  {
    id: 'evt-1',
    title: 'New Restaurant Registered',
    desc: 'Saffron Spice Kitchen (Bangalore)',
    time: '5m ago',
    icon: Store,
    iconBg: 'bg-blue-50 text-blue-600',
  },
  {
    id: 'evt-2',
    title: 'Order Delivered',
    desc: 'Order #ORD-8921 (₹640 COD)',
    time: '12m ago',
    icon: ShoppingBag,
    iconBg: 'bg-emerald-50 text-emerald-600',
  },
  {
    id: 'evt-3',
    title: 'Role Promoted',
    desc: 'user_9812 assigned to MANAGER',
    time: '45m ago',
    icon: Users,
    iconBg: 'bg-purple-50 text-purple-600',
  },
];
