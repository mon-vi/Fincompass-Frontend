import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title?: string;
}

const variantClasses: Record<AlertVariant, string> = {
  info: 'bg-sky-50 border-sky-200 text-sky-900',
  success: 'bg-emerald-50 border-emerald-200 text-emerald-900',
  warning: 'bg-amber-50 border-amber-200 text-amber-900',
  error: 'bg-red-50 border-red-200 text-red-900',
};

const iconClasses: Record<AlertVariant, string> = {
  info: 'bg-sky-100 text-sky-700',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  error: 'bg-red-100 text-red-700',
};

function AlertIcon({ variant }: { variant: AlertVariant }) {
  if (variant === 'success') {
    return (
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
        <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414l2.293 2.293 6.543-6.543a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    );
  }
  if (variant === 'error') {
    return (
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    );
  }
  if (variant === 'warning') {
    return (
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.721-1.36 3.486 0l6.518 11.59c.75 1.334-.213 2.986-1.743 2.986H3.482c-1.53 0-2.493-1.652-1.743-2.986l6.518-11.59zM11 14a1 1 0 10-2 0 1 1 0 002 0zm-1-2a1 1 0 01-1-1V7a1 1 0 112 0v4a1 1 0 01-1 1z" clipRule="evenodd" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
      <path fillRule="evenodd" d="M18 10A8 8 0 112 10a8 8 0 0116 0zm-7-3a1 1 0 10-2 0 1 1 0 002 0zM9 9a1 1 0 000 2v3a1 1 0 102 0v-4a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
  );
}

export function Alert({ variant = 'info', title, className, children, ...props }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex gap-3 rounded-2xl border p-4 text-sm',
        'shadow-sm shadow-slate-900/[0.03]',
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      <span className={cn('mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full', iconClasses[variant])} aria-hidden="true">
        <AlertIcon variant={variant} />
      </span>
      <div className="flex flex-col gap-1 leading-6">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div>{children}</div>}
      </div>
    </div>
  );
}
