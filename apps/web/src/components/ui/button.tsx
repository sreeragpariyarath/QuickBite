'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';

type Variant = 'primary' | 'secondary' | 'ghost';

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-teal-600 text-white hover:bg-teal-500 disabled:bg-teal-600/50 shadow-lg shadow-teal-600/20',
  secondary:
    'bg-white/10 text-white hover:bg-white/20 border border-white/15 disabled:opacity-50',
  ghost: 'text-zinc-500 hover:text-zinc-800 disabled:opacity-50',
};

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children?: React.ReactNode;
  variant?: Variant;
  fullWidth?: boolean;
  loading?: boolean;
}

export function Button({
  variant = 'primary',
  fullWidth,
  loading,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.1 }}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 disabled:cursor-not-allowed ${VARIANTS[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {loading && (
        <span
          aria-hidden
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      {children}
    </motion.button>
  );
}
