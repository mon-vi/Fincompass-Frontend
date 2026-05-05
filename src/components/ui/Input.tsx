import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-semibold text-slate-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'min-h-11 w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-950 shadow-sm shadow-slate-900/[0.02]',
            'placeholder:text-slate-400',
            'transition-all duration-150',
            'focus:border-[#2b6d91] focus:outline-none focus:ring-4 focus:ring-[#2b6d91]/15',
            'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400',
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-red-500/15'
              : 'border-slate-300/90 hover:border-slate-400',
            className,
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="text-xs font-medium text-red-600" role="alert">
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={`${inputId}-hint`} className="text-xs leading-5 text-slate-500">
            {hint}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
