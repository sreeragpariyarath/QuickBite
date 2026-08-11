'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/header';

/**
 * Layout for the main app: sticky header + width-constrained content.
 * Admin/Partner routes skip the customer delivery header for clean rendering.
 */
export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    return <div className="min-h-screen bg-white">{children}</div>;
  }

  return (
    <>
      <Header />
      <main className="w-full max-w-6xl mx-auto flex-1 px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </>
  );
}
