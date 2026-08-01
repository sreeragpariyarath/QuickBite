'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Store,
  ShoppingBag,
  LogOut,
  Bell,
  Sparkles,
} from 'lucide-react';
import { clearAuthToken, getAuthToken, getStoredUser } from '@/lib/api';
import { motion } from 'framer-motion';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Restaurants', href: '/restaurants', icon: Store },
  { name: 'Orders', href: '/orders', icon: ShoppingBag },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = getAuthToken();
    const storedUser = getStoredUser();
    if (!token) {
      setUser({ name: 'Super Admin', email: 'admin@quickbite.com', role: 'SUPER_ADMIN' });
    } else {
      setUser(storedUser || { name: 'Super Admin', email: 'admin@quickbite.com', role: 'SUPER_ADMIN' });
    }
  }, [router]);

  const handleLogout = () => {
    clearAuthToken();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans select-none relative">
      
      {/* Top Header Navigation */}
      <header className="h-16 border-b border-slate-200/60 bg-white/80 backdrop-blur-md px-6 lg:px-10 flex items-center justify-between sticky top-0 z-20">
        
        {/* Portal Branding */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white">
            <Sparkles className="w-4.5 h-4.5 text-blue-400" />
          </div>
          <div>
            <span className="font-heading font-bold text-sm tracking-wide text-slate-900">QuickBite</span>
            <span className="block text-[9px] font-bold text-blue-600 uppercase tracking-widest leading-none mt-0.5">Partner Portal</span>
          </div>
        </div>

        {/* User profile & Actions */}
        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-400 hover:text-slate-600 bg-slate-50 border border-slate-200/50 rounded-xl relative cursor-pointer transition">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full" />
          </button>

          {/* User Info Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200/40 rounded-xl">
            <div className="w-6 h-6 rounded-md bg-slate-900 text-white font-bold flex items-center justify-center text-[10px]">
              {user?.name?.substring(0, 2).toUpperCase() || 'SA'}
            </div>
            <div className="text-left">
              <p className="text-[10px] font-bold text-slate-700 leading-tight">
                {user?.name || 'Super Admin'}
              </p>
              <p className="text-[8px] text-slate-400 font-mono leading-none">
                {user?.role || 'SUPER_ADMIN'}
              </p>
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-red-50 hover:text-red-600 border border-slate-200/50 hover:border-red-200 rounded-xl text-xs font-semibold text-slate-600 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Page Content Body */}
      <main className="flex-1 p-6 lg:p-10 pb-28 overflow-y-auto">
        {children}
      </main>

      {/* Floating Bottom Navigation Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 w-full max-w-[500px] px-4">
        <nav className="w-full bg-white/95 backdrop-blur-xl border border-slate-200 shadow-[0_12px_40px_rgba(15,23,42,0.08)] rounded-full p-1.5 flex items-center justify-between">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex items-center gap-2 px-4.5 py-2.5 rounded-full text-xs font-semibold transition-colors duration-300 select-none z-10 group"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute inset-0 bg-slate-900 rounded-full z-[-1] shadow-lg shadow-slate-900/10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <motion.div
                  className="flex items-center gap-2"
                  whileTap={{ scale: 0.96 }}
                >
                  <Icon className={`w-4 h-4 shrink-0 transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-800'}`} />
                  <span className={`text-xs transition-colors duration-300 whitespace-nowrap ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-800'}`}>{item.name}</span>
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </div>

    </div>
  );
}
