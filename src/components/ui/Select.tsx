import { forwardRef } from 'react';
import type { SelectHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, className, id, children, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-semibold text-slate-700">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'min-h-11 rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-950 shadow-sm shadow-slate-900/[0.02]',
            'transition-all duration-150',
            'focus:border-[#2b6d91] focus:outline-none focus:ring-4 focus:ring-[#2b6d91]/15',
            'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400',
            error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/15' : 'border-slate-300/90 hover:border-slate-400',
            className,
          )}
          aria-invalid={!!error}
          {...props}
        >
          {children}
        </select>
        {error && <p className="text-xs font-medium text-red-600" role="alert">{error}</p>}
        {!error && hint && <p className="text-xs leading-5 text-slate-500">{hint}</p>}
      </div>
    );
  },
);

Select.displayName = 'Select';
