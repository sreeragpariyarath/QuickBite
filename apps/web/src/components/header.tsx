'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

const STANDALONE_ROUTES = ['/login', '/signup', '/auth/verified'];

export function Header() {
  const { profile, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Auth pages render their own immersive layout (AuthShell)
  if (STANDALONE_ROUTES.includes(pathname)) return null;

  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-sm font-black text-white">
            QB
          </span>
          <span className="text-lg font-bold text-zinc-900">
            Quick<span className="text-teal-600">Bite</span>
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {loading ? null : profile ? (
            <>
              <Link href="/orders" className="hover:text-teal-600">
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
                className="text-zinc-500 hover:text-teal-600"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-teal-600 px-4 py-1.5 font-semibold text-white hover:bg-teal-500"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
