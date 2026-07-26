'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';

type Variant = 'primary' | 'secondary' | 'ghost';

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-[#335438] text-white hover:bg-[#27402b] disabled:bg-[#335438]/50 shadow-md shadow-[#335438]/10 cursor-pointer',
  secondary:
    'bg-zinc-100 text-zinc-800 hover:bg-zinc-200 border border-zinc-200 disabled:opacity-50 cursor-pointer',
  ghost: 'text-zinc-500 hover:text-zinc-800 disabled:opacity-50 cursor-pointer',
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
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#335438] disabled:cursor-not-allowed ${VARIANTS[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
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
