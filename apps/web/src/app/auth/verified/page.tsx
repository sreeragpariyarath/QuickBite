'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { AuthShell } from '@/components/auth/auth-shell';
import { Button } from '@/components/ui/button';

export default function EmailVerifiedPage() {
  return (
    <AuthShell>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="py-4 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.5, delay: 0.15 }}
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-3xl"
        >
          ✅
        </motion.div>
        <h2 className="text-2xl font-bold">Email verified!</h2>
        <p className="mt-2 text-sm text-zinc-500">
          Your email address is confirmed. Log in to start ordering.
        </p>
        <Link href="/login" className="mt-6 block">
          <Button fullWidth>Go to login</Button>
        </Link>
      </motion.div>
    </AuthShell>
  );
}
