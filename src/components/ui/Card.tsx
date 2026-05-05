import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padded?: boolean;
}

export function Card({ padded = true, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200/80 bg-white/95 shadow-sm shadow-slate-900/[0.04] backdrop-blur',
        padded && 'p-5 sm:p-6',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-base font-semibold tracking-tight text-slate-950', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('text-sm leading-6 text-slate-600', className)} {...props}>
      {children}
    </div>
  );
}
