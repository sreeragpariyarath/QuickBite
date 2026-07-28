import { Header } from '@/components/header';

/**
 * Layout for the main app: sticky header + width-constrained content.
 * Auth pages live in the (auth) group and render full-bleed without this.
 */
export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="w-full max-w-6xl mx-auto flex-1 px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </>
  );
}
