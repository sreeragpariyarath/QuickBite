'use client';

import { forwardRef, useId, useState } from 'react';

interface TextFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label: React.ReactNode;
  hint?: string;
  error?: string | null;
  prefix?: React.ReactNode;
  icon?: React.ReactNode;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField({ label, hint, error, prefix, icon, className = '', ...props }, ref) {
    const id = useId();
    const [showPassword, setShowPassword] = useState(false);

    const inputType = props.type === 'password' && showPassword ? 'text' : props.type;

    return (
      <div>
        <label
          htmlFor={id}
          className="mb-1.5 block text-sm font-medium text-zinc-700"
        >
          {label}
        </label>
        <div
          className={`flex items-stretch overflow-hidden rounded-xl border bg-white transition-colors focus-within:ring-2 focus-within:ring-[#335438] ${
            error ? 'border-red-400' : 'border-zinc-300'
          }`}
        >
          {prefix && (
            <span className="flex items-center border-r border-zinc-200 bg-zinc-50 px-2 text-sm font-medium text-zinc-600">
              {prefix}
            </span>
          )}
          {icon && (
            <span className="flex items-center pl-3.5 text-zinc-400">
              {icon}
            </span>
          )}
          <input
            id={id}
            ref={ref}
            className={`w-full bg-transparent ${icon ? 'pl-2 pr-3.5' : 'px-3.5'} py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none ${className}`}
            {...props}
            type={inputType}
          />
          {props.type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="flex items-center px-3.5 text-zinc-400 hover:text-zinc-600 focus:outline-none cursor-pointer"
            >
              {showPassword ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          )}
        </div>
        {hint && !error && <p className="mt-1 text-xs text-zinc-500">{hint}</p>}
      </div>
    );
  }
);
