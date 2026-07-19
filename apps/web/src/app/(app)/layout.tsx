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
      <main className="w-full max-w-4xl mx-auto flex-1 px-4 py-6">
        {children}
      </main>
    </>
  );
}
