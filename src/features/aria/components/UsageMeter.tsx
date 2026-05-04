import { cn } from '@/utils/cn';
import { safeFormatDate } from '@/utils/formatters';
import type { AriaUsage } from '../services';

interface UsageMeterProps {
  usage: AriaUsage;
  className?: string;
}

export function UsageMeter({ usage, className }: UsageMeterProps) {
  const pct = Math.min((usage.used / usage.limit) * 100, 100);
  const isNearLimit = pct >= 80;
  const isAtLimit = pct >= 100;

  const resets = safeFormatDate(usage.resetsAt, { month: 'short', day: 'numeric' });

  return (
    <div className={cn('rounded-2xl border border-slate-200 bg-white p-3 shadow-sm shadow-slate-900/[0.03]', className)}>
      <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
        <span className="font-medium text-slate-700">ARIA messages</span>
        <span>
          <span className={cn('font-semibold', isAtLimit ? 'text-red-600' : isNearLimit ? 'text-amber-600' : 'text-slate-700')}>
            {usage.used}
          </span>
          /{usage.limit} used
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300',
            isAtLimit ? 'bg-red-500' : isNearLimit ? 'bg-amber-500' : 'bg-[#2b6d91]',
          )}
          style={{ width: `${pct}%` }}
        />
      </div>

      {isAtLimit ? (
        <p className="mt-1.5 text-[10px] text-red-600">Limit reached. Resets {resets}.</p>
      ) : (
        <p className="mt-1.5 text-[10px] text-slate-400">Resets {resets}</p>
      )}
    </div>
  );
}
