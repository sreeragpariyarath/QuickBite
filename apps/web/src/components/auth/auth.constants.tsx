import { Clock, Star, ShieldCheck } from 'lucide-react';

export interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  text: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export const FEATURES: FeatureItem[] = [
  {
    icon: <Clock className="h-5 w-5 stroke-[#335438] stroke-[2.5]" />,
    title: 'Fast Delivery',
    text: 'On-time, every time',
  },
  {
    icon: <Star className="h-5 w-5 stroke-[#335438] stroke-[2.5]" />,
    title: 'Top Restaurants',
    text: 'Handpicked for you',
  },
  {
    icon: <ShieldCheck className="h-5 w-5 stroke-[#335438] stroke-[2.5]" />,
    title: 'Safe & Secure',
    text: 'Your data is protected',
  },
];

export const STATS: StatItem[] = [
  { value: '50K+', label: 'Happy customers' },
  { value: '5K+', label: 'Restaurants' },
  { value: '1M+', label: 'Orders delivered' },
];
