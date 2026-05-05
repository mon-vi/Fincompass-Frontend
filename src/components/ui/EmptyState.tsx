import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-slate-200 bg-white/80 px-5 py-12 text-center shadow-sm shadow-slate-900/[0.03] sm:px-6 sm:py-14', className)}>
      {icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#12355b]/10 text-[#12355b] ring-1 ring-[#12355b]/10">
          {icon}
        </div>
      )}
      <p className="text-base font-semibold text-slate-950">{title}</p>
      {description && <p className="mt-1 max-w-md text-sm leading-6 text-slate-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
