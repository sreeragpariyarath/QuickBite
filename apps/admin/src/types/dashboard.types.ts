import { LucideIcon } from 'lucide-react';

export interface KpiStatItem {
  id: string;
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  bgColor: string;
  textColor: string;
  badgeBg: string;
}

export interface MicroserviceHealthItem {
  id: string;
  name: string;
  port: number;
  status: 'Healthy' | 'Degraded' | 'Standby' | 'Offline';
  db: string;
  uptime: string;
}

export interface ActivityEventItem {
  id: string | number;
  title: string;
  desc: string;
  time: string;
  icon: LucideIcon;
  iconBg: string;
}
