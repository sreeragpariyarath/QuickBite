'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Lock, ShieldCheck, Headphones, Zap, ArrowLeft } from 'lucide-react';
import { FEATURES, STATS } from './auth.constants';

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-r from-white to-[#F0EFED] text-zinc-900">
      {/* background image */}
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/auth_bg.png"
          alt=""
          fill
          priority
          className="object-cover object-right"
        />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 lg:px-8">
        <motion.header
          {...fadeUp(0)}
          className="flex items-center justify-between w-full relative"
        >
          {/* Back arrow on left for mobile */}
          <Link href="/" className="lg:hidden text-zinc-800 hover:text-zinc-900 z-10">
            <ArrowLeft className="h-6 w-6" />
          </Link>

          {/* Logo (Centered on mobile, left-aligned on desktop) */}
          <Link
            href="/"
            className="flex items-center gap-2 lg:static absolute left-1/2 -translate-x-1/2 lg:translate-x-0"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#335438] font-black text-white">
              QB
            </span>
            <span className="text-xl font-bold">
              Quick<span className="text-[#335438]">Bite</span>
            </span>
          </Link>

          {/* Right link for desktop */}
          <Link
            href="/"
            className="hidden lg:flex text-sm font-semibold text-zinc-600 transition hover:text-zinc-900 items-center gap-1"
          >
            Browse restaurants <span className="text-base">→</span>
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
            <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-6 text-zinc-900 shadow-2xl shadow-zinc-200/50 sm:p-8 border border-zinc-100">
              {children}
            </div>
          </motion.div>

          {/* hero copy - hidden on mobile/tablet, visible on desktop */}
          <div className="order-2 lg:order-1 hidden lg:block">
            <motion.div
              {...fadeUp(0.1)}
              className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#F2F3E9] px-4 py-1.5 text-xs font-semibold text-[#335438]"
            >
              <Zap className="h-3.5 w-3.5 fill-[#335438] text-[#335438]" />
              <span>Fast delivery</span>
              <span className="text-[#335438]/20">•</span>
              <span>Live tracking</span>
            </motion.div>
            <motion.h1
              {...fadeUp(0.2)}
              className="text-4xl font-black leading-tight sm:text-5xl text-zinc-900"
            >
              Good food,{' '}
              <span className="text-[#5b8c66]">delivered</span> to your door.
            </motion.h1>
            <motion.p {...fadeUp(0.3)} className="mt-4 max-w-md text-zinc-500">
              Order from top restaurants near you and enjoy fresh meals, fast.
            </motion.p>

            {/* Horizontal row of 3 feature boxes */}
            <motion.ul {...fadeUp(0.4)} className="mt-10 grid grid-cols-3 gap-4">
              {FEATURES.map((f) => (
                <li key={f.title} className="flex flex-col items-center text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F2F3E9] text-[#335438] mb-3">
                    {f.icon}
                  </span>
                  <p className="font-bold text-xs text-zinc-800 leading-snug">{f.title}</p>
                  <p className="text-[10px] text-zinc-500 mt-1 leading-normal">{f.text}</p>
                </li>
              ))}
            </motion.ul>

            {/* Stats list separated by dividers and thin line on top */}
            <motion.div
              {...fadeUp(0.5)}
              className="mt-8 pt-8 border-t border-zinc-200/80 flex justify-between items-center"
            >
              {STATS.map((s, idx) => (
                <div key={s.label} className="flex-1 text-center relative">
                  {idx > 0 && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-[1px] bg-zinc-200" />
                  )}
                  <p className="text-xl font-black text-zinc-900">
                    {s.value}
                  </p>
                  <p className="text-[10px] text-zinc-500 mt-1">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        <motion.footer
          {...fadeUp(0.6)}
          className="flex flex-wrap items-center justify-between border-t border-zinc-200/60 pt-4 text-xs text-zinc-400"
        >
          <div className="flex gap-4">
            <span className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5 stroke-[2.5]" /> 100% Secure payments</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 stroke-[2.5]" /> Privacy protected</span>
            <span className="flex items-center gap-1.5"><Headphones className="h-3.5 w-3.5 stroke-[2.5]" /> 24/7 Support</span>
          </div>
          <span>© {new Date().getFullYear()} QuickBite</span>
        </motion.footer>
      </div>
    </div>
  );
}
