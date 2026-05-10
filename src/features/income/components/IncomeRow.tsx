import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useDeleteIncome } from '../hooks';
import { INCOME_TYPE_LABELS, INCOME_FREQUENCY_LABELS } from '../services';
import { formatCurrency } from '@/utils/formatters';
import type { IncomeRecord } from '../services';

interface IncomeRowProps {
  record: IncomeRecord;
  onEdit?: (record: IncomeRecord) => void;
}

const TYPE_ICONS: Record<string, string> = {
  salary: '💼',
  freelance: '🖥️',
  rental: '🏠',
  investment: '📈',
  pension: '🏦',
  other: '💰',
};

export function IncomeRow({ record, onEdit }: IncomeRowProps) {
  const remove = useDeleteIncome();

  return (
    <div className="flex flex-col gap-3 rounded-2xl px-2 py-3 transition hover:bg-slate-50 sm:flex-row sm:items-center">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-lg ring-1 ring-emerald-100">
        {TYPE_ICONS[record.type] ?? '💰'}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-slate-950">{record.sourceName}</p>
        <div className="mt-0.5 flex flex-wrap items-center gap-2">
          <Badge variant="default" className="text-xs">{INCOME_TYPE_LABELS[record.type]}</Badge>
          <Badge variant="info" className="text-xs">{INCOME_FREQUENCY_LABELS[record.frequency]}</Badge>
          {!record.isActive && <Badge variant="warning" className="text-xs">Inactive</Badge>}
        </div>
      </div>

      <div className="shrink-0 text-right">
        <span className="block text-base font-black tracking-tight text-slate-950">
          {formatCurrency(record.amount)}
        </span>
        {record.frequency !== 'monthly' && (
          <span className="text-xs text-slate-400">
            {formatCurrency(record.monthlyAmount)}/mo
          </span>
        )}
      </div>

      <div className="flex shrink-0 gap-1 sm:ml-2">
        {onEdit && (
          <Button variant="ghost" size="sm" onClick={() => onEdit(record)}>Edit</Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          isLoading={remove.isPending}
          onClick={() => {
            if (confirm('Delete this income source?')) {
              remove.mutate(record.id);
            }
          }}
          className="text-red-600 hover:text-red-700"
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
