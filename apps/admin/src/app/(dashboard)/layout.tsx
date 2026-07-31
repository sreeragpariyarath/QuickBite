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
  ShieldAlert,
  ChevronRight,
  Menu,
  X,
  Bell,
  Sparkles,
} from 'lucide-react';
import { clearAuthToken, getAuthToken, getStoredUser } from '@/lib/api';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'User Management', href: '/users', icon: Users },
  { name: 'Restaurants', href: '/restaurants', icon: Store },
  { name: 'Live Orders', href: '/orders', icon: ShoppingBag },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = getAuthToken();
    const storedUser = getStoredUser();
    if (!token) {
      // For development demo purposes, set mock user if none logged in
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
    <div className="min-h-screen bg-[#0b0f17] flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-gray-800/80 bg-[#111827]/70 backdrop-blur-xl shrink-0">
        <div className="p-6 border-b border-gray-800/80 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-center text-emerald-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-white tracking-wide text-base">QuickBite</h1>
            <p className="text-xs text-emerald-400 font-medium">Admin Control Center</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
            Management
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-gray-500'}`} />
                  <span>{item.name}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-emerald-400" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800/80">
          <div className="p-3 bg-[#162032] border border-gray-800 rounded-xl flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                SA
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">
                  {user?.name || 'Super Admin'}
                </p>
                <p className="text-[10px] text-emerald-400 font-mono">
                  {user?.role || 'SUPER_ADMIN'}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-gray-800/60 hover:bg-red-500/10 hover:text-red-400 border border-gray-700/50 hover:border-red-500/30 rounded-xl text-xs font-medium text-gray-400 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation Header */}
        <header className="h-16 border-b border-gray-800/80 bg-[#111827]/40 backdrop-blur-md px-4 lg:px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-gray-400 hover:text-white rounded-lg"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono">
                Environment: Production
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-400 hover:text-white bg-gray-800/40 border border-gray-800 rounded-xl relative cursor-pointer">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full" />
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm flex">
            <div className="w-64 bg-[#111827] h-full p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-gray-800 mb-4">
                  <span className="font-bold text-white">QuickBite Admin</span>
                  <button onClick={() => setMobileOpen(false)} className="text-gray-400">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                        pathname === item.href
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'text-gray-400'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </nav>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 p-2.5 bg-red-500/10 text-red-400 rounded-xl text-xs font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}

        {/* Page View Body */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
