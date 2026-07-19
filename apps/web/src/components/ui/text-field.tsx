'use client';

import { forwardRef, useId } from 'react';

interface TextFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label: string;
  hint?: string;
  error?: string | null;
  prefix?: React.ReactNode;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField({ label, hint, error, prefix, className = '', ...props }, ref) {
    const id = useId();
    return (
      <div>
        <label
          htmlFor={id}
          className="mb-1.5 block text-sm font-medium text-zinc-700"
        >
          {label}
        </label>
        <div
          className={`flex items-stretch overflow-hidden rounded-xl border bg-white transition-colors focus-within:ring-2 focus-within:ring-teal-500 ${
            error ? 'border-red-400' : 'border-zinc-300'
          }`}
        >
          {prefix && (
            <span className="flex items-center border-r border-zinc-200 bg-zinc-50 px-3 text-sm font-medium text-zinc-600">
              {prefix}
            </span>
          )}
          <input
            id={id}
            ref={ref}
            className={`w-full bg-transparent px-3.5 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none ${className}`}
            {...props}
          />
        </div>
        {hint && !error && (
          <p className="mt-1.5 text-xs text-zinc-500">{hint}</p>
        )}
        {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
      </div>
    );
  },
);
