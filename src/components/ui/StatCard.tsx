import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { Skeleton } from './Loader';

interface StatCardProps {
  label: string;
  value: string;
  subtext?: string;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  isLoading?: boolean;
  className?: string;
}

const trendClasses = {
  up: 'text-emerald-600',
  down: 'text-red-500',
  neutral: 'text-slate-500',
};

export function StatCard({ label, value, subtext, icon, trend, isLoading, className }: StatCardProps) {
  return (
    <div className={cn('rounded-xl border border-slate-200 bg-white p-5 shadow-sm', className)}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
        {icon && <div className="shrink-0 text-slate-400">{icon}</div>}
      </div>
      {isLoading ? (
        <div className="mt-2 space-y-1">
          <Skeleton className="h-7 w-28" />
          <Skeleton className="h-4 w-20" />
        </div>
      ) : (
        <div className="mt-2">
          <p className="text-2xl font-bold text-slate-900">{value}</p>
          {subtext && (
            <p className={cn('mt-0.5 text-xs', trend ? trendClasses[trend] : 'text-slate-500')}>
              {subtext}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
