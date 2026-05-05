import { cn } from '@/utils/cn';
import { useDismissGuidance } from '../hooks';
import type { GuidanceItem, GuidanceType } from '../services';

interface GuidanceCardProps {
  item: GuidanceItem;
}

const typeStyles: Record<GuidanceType, { border: string; bg: string; icon: string; iconColor: string }> = {
  warning: {
    border: 'border-amber-200',
    bg: 'bg-amber-50',
    icon: '⚠',
    iconColor: 'text-amber-500',
  },
  insight: {
    border: 'border-[#2b6d91]/20',
    bg: 'bg-[#2b6d91]/5',
    icon: '💡',
    iconColor: 'text-[#2b6d91]',
  },
  tip: {
    border: 'border-emerald-200',
    bg: 'bg-emerald-50',
    icon: '✓',
    iconColor: 'text-emerald-500',
  },
};

export function GuidanceCard({ item }: GuidanceCardProps) {
  const dismiss = useDismissGuidance();
  const styles = typeStyles[item.type];

  return (
    <div className={cn('rounded-2xl border p-4 shadow-sm shadow-slate-900/[0.03]', styles.border, styles.bg)}>
      <div className="flex items-start gap-3">
        <span className={cn('mt-0.5 shrink-0 text-base', styles.iconColor)} aria-hidden="true">
          {styles.icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900">{item.title}</p>
          <p className="mt-0.5 text-xs text-slate-600">{item.body}</p>
        </div>
        <button
          type="button"
          aria-label="Dismiss"
          disabled={dismiss.isPending}
          onClick={() => dismiss.mutate(item.id)}
          className="shrink-0 rounded-lg p-1 text-slate-400 hover:bg-white/70 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2b6d91]"
        >
          <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4">
            <path d="M4.47 4.47a.75.75 0 011.06 0L8 6.94l2.47-2.47a.75.75 0 111.06 1.06L9.06 8l2.47 2.47a.75.75 0 11-1.06 1.06L8 9.06l-2.47 2.47a.75.75 0 01-1.06-1.06L6.94 8 4.47 5.53a.75.75 0 010-1.06z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
