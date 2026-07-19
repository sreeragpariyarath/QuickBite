'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const FEATURES = [
  {
    icon: '⚡',
    title: 'Lightning fast delivery',
    text: 'Your favorite meals delivered hot and on time.',
  },
  {
    icon: '⭐',
    title: 'Top rated restaurants',
    text: 'Handpicked restaurants near you.',
  },
  {
    icon: '🛡️',
    title: 'Safe & secure',
    text: 'Your data and payments are protected.',
  },
];

const STATS = [
  { value: '50K+', label: 'Happy customers' },
  { value: '5K+', label: 'Restaurants' },
  { value: '1M+', label: 'Orders delivered' },
];

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

/**
 * Two-column auth layout: marketing hero on the left, the auth card on the
 * right. Stacks vertically on mobile (card first — it's what users came for).
 */
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#04252b] text-white">
      {/* hero food image as ambient backdrop */}
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/login_food.png"
          alt=""
          fill
          priority
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#04252b] via-[#04252b]/80 to-[#063a42]/70" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 lg:px-8">
        <motion.header
          {...fadeUp(0)}
          className="flex items-center justify-between"
        >
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500 font-black text-white">
              QB
            </span>
            <span className="text-xl font-bold">
              Quick<span className="text-teal-400">Bite</span>
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm text-white/70 transition hover:text-white"
          >
            Browse restaurants →
          </Link>
        </motion.header>

        <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-2 lg:gap-16">
          {/* auth card — first on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="order-1 lg:order-2"
          >
            <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-6 text-zinc-900 shadow-2xl shadow-black/40 sm:p-8">
              {children}
            </div>
          </motion.div>

          {/* hero copy */}
          <div className="order-2 lg:order-1">
            <motion.p
              {...fadeUp(0.1)}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-wide"
            >
              ⚡ FAST DELIVERY · LIVE TRACKING
            </motion.p>
            <motion.h1
              {...fadeUp(0.2)}
              className="text-4xl font-black leading-tight sm:text-5xl"
            >
              Good food,{' '}
              <span className="text-teal-400">delivered</span> to your door.
            </motion.h1>
            <motion.p {...fadeUp(0.3)} className="mt-4 max-w-md text-white/70">
              Discover the best restaurants near you and enjoy your favorite
              meals, delivered fast and fresh.
            </motion.p>

            <motion.ul {...fadeUp(0.4)} className="mt-8 space-y-4">
              {FEATURES.map((f) => (
                <li key={f.title} className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-lg">
                    {f.icon}
                  </span>
                  <div>
                    <p className="font-semibold">{f.title}</p>
                    <p className="text-sm text-white/60">{f.text}</p>
                  </div>
                </li>
              ))}
            </motion.ul>

            <motion.div
              {...fadeUp(0.5)}
              className="mt-8 flex max-w-md divide-x divide-white/10 rounded-2xl border border-white/10 bg-white/5"
            >
              {STATS.map((s) => (
                <div key={s.label} className="flex-1 px-4 py-3 text-center">
                  <p className="text-lg font-extrabold text-teal-400">
                    {s.value}
                  </p>
                  <p className="text-xs text-white/60">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        <motion.footer
          {...fadeUp(0.6)}
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-white/10 pt-4 text-xs text-white/50"
        >
          <span>🔒 100% Secure</span>
          <span>🛡️ Privacy protected</span>
          <span>🎧 24/7 Support</span>
          <span>© {new Date().getFullYear()} QuickBite</span>
        </motion.footer>
      </div>
    </div>
  );
}
