import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'QuickBite Admin Portal',
  description: 'Enterprise Super Admin & Operations Management System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#0b0f17] text-gray-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
