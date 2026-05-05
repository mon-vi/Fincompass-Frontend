import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'accent' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-[#12355b] text-white shadow-sm shadow-slate-900/10 hover:bg-[#0b2746] focus-visible:ring-[#2b6d91]',
  secondary: 'bg-white text-slate-800 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 focus-visible:ring-[#2b6d91]',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100/80 focus-visible:ring-[#2b6d91]',
  danger: 'bg-red-600 text-white shadow-sm shadow-red-900/10 hover:bg-red-700 focus-visible:ring-red-500',
  outline: 'border border-slate-300 bg-white/70 text-slate-700 hover:border-slate-400 hover:bg-white focus-visible:ring-[#2b6d91]',
  accent: 'bg-[#d97735] text-white shadow-sm shadow-orange-900/10 hover:bg-[#bf6428] focus-visible:ring-[#f4b460]',
  success: 'bg-emerald-600 text-white shadow-sm shadow-emerald-900/10 hover:bg-emerald-700 focus-visible:ring-emerald-500',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'min-h-9 px-3 py-1.5 text-sm',
  md: 'min-h-11 px-4 py-2.5 text-sm',
  lg: 'min-h-12 px-6 py-3 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  disabled,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-bold',
        'transition-all duration-150 active:scale-[0.99]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {isLoading && (
        <svg
          className="h-4 w-4 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
