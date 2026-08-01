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
      
      {/* Main Page Content Body */}
      <main className="flex-1 p-6 lg:p-10 pb-28 overflow-y-auto">
        {children}
      </main>

      {/* Floating Bottom Navigation Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 w-full max-w-[540px] px-4">
        <nav className="w-full bg-white/95 backdrop-blur-xl border border-slate-200 shadow-[0_12px_40px_rgba(15,23,42,0.08)] rounded-full p-1.5 flex items-center justify-between gap-1">
          <div className="flex items-center justify-between flex-1">
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
          </div>

          {/* Divider */}
          <div className="w-[1px] h-6 bg-slate-200 shrink-0 mx-1" />

          {/* Profile Avatar & Sign Out Action */}
          <div className="flex items-center gap-1 shrink-0 pl-1 pr-1.5">
            <div 
              className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 text-[10px] font-bold select-none cursor-default"
              title={`${user?.name || 'Super Admin'} (${user?.role || 'SUPER_ADMIN'})`}
            >
              {user?.name?.substring(0, 2).toUpperCase() || 'SA'}
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer flex items-center justify-center"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </nav>
      </div>

    </div>
  );
}
