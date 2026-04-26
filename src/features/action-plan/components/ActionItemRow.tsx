import { cn } from '@/utils/cn';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/utils/formatters';
import { useToggleActionItem } from '../hooks';
import type { ActionItem } from '../services';

interface ActionItemRowProps {
  item: ActionItem;
}

const categoryColors: Record<string, string> = {
  debt: 'danger',
  budget: 'warning',
  savings: 'success',
  income: 'info',
};

const priorityLabel: Record<string, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

export function ActionItemRow({ item }: ActionItemRowProps) {
  const toggle = useToggleActionItem();

  return (
    <div className={cn('flex items-start gap-3 rounded-xl border p-4 transition-colors', item.isCompleted ? 'border-emerald-100 bg-emerald-50' : 'border-slate-200 bg-white')}>
      <button
        type="button"
        aria-label={item.isCompleted ? 'Mark incomplete' : 'Mark complete'}
        disabled={toggle.isPending}
        onClick={() => toggle.mutate({ id: item.id, payload: { isCompleted: !item.isCompleted } })}
        className={cn(
          'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
          item.isCompleted
            ? 'border-emerald-500 bg-emerald-500 text-white'
            : 'border-slate-300 hover:border-indigo-400',
        )}
      >
        {item.isCompleted && (
          <svg viewBox="0 0 12 10" fill="none" className="h-3 w-3">
            <path d="M1 5l3.5 3.5L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className={cn('text-sm font-semibold', item.isCompleted ? 'text-emerald-700 line-through' : 'text-slate-900')}>
            {item.title}
          </p>
          <Badge variant={categoryColors[item.category] as 'danger' | 'warning' | 'success' | 'info'}>
            {item.category}
          </Badge>
          {item.priority === 'high' && !item.isCompleted && (
            <Badge variant="danger">{priorityLabel[item.priority]}</Badge>
          )}
        </div>
        <p className="mt-0.5 text-xs text-slate-500 line-clamp-2">{item.description}</p>
        {item.dueDate && !item.isCompleted && (
          <p className="mt-1 text-xs text-amber-600">Due {formatDate(item.dueDate)}</p>
        )}
        {item.completedAt && item.isCompleted && (
          <p className="mt-1 text-xs text-emerald-600">Completed {formatDate(item.completedAt)}</p>
        )}
      </div>
    </div>
  );
}
