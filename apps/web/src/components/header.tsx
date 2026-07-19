'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

export function Header() {
  const { profile, loading, logout } = useAuth();
  const router = useRouter();

  return (
    <header className="bg-white border-b border-zinc-200 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-red-600">
          QuickBite
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {loading ? null : profile ? (
            <>
              <Link href="/orders" className="hover:text-red-600">
                My orders
              </Link>
              <span className="text-zinc-500">
                {profile.name ?? profile.phone}
              </span>
              <button
                onClick={() => {
                  logout();
                  router.push('/');
                }}
                className="text-zinc-500 hover:text-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-red-600 text-white px-4 py-1.5 rounded-md hover:bg-red-700"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
