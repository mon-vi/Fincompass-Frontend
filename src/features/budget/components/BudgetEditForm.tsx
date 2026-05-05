import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/utils/formatters';
import { useUpdateBudget } from '../hooks';
import type { Budget } from '../services';

interface BudgetEditFormProps {
  budget: Budget;
  onClose: () => void;
}

export function BudgetEditForm({ budget, onClose }: BudgetEditFormProps) {
  const [amounts, setAmounts] = useState<Record<string, string>>(() =>
    Object.fromEntries(budget.categories.map((c) => [c.id, String(c.budgeted)])),
  );

  const update = useUpdateBudget();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const categories = budget.categories.map((c) => ({
      id: c.id,
      budgeted: Math.max(0, parseFloat(amounts[c.id] ?? '0') || 0),
    }));
    update.mutate(
      { month: budget.month, categories },
      { onSuccess: onClose },
    );
  };

  const newTotal = Object.values(amounts).reduce((sum, v) => sum + (parseFloat(v) || 0), 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-3">
        {budget.categories.map((cat) => (
          <div key={cat.id} className="flex flex-col gap-2 rounded-2xl bg-slate-50 p-3 sm:flex-row sm:items-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-lg leading-none ring-1 ring-slate-200">{cat.icon}</span>
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-700">{cat.name}</span>
            <div className="relative w-full sm:w-36">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-slate-400">
                $
              </span>
              <input
                type="number"
                min="0"
                step="1"
                value={amounts[cat.id] ?? ''}
                onChange={(e) => setAmounts((prev) => ({ ...prev, [cat.id]: e.target.value }))}
                className="min-h-10 w-full rounded-xl border border-slate-300 bg-white py-1.5 pl-7 pr-3 text-right text-sm focus:border-[#2b6d91] focus:outline-none focus:ring-4 focus:ring-[#2b6d91]/15"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-100 pt-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-slate-500">
          Total: <span className="font-semibold text-slate-800">{formatCurrency(newTotal)}</span>
        </div>
        <div className="flex flex-col-reverse gap-2 sm:flex-row">
          <Button
            type="button"
            onClick={onClose}
            variant="outline"
            size="sm"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={update.isPending}
            size="sm"
          >
            {update.isPending ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </div>

      {update.isError && (
        <p className="text-xs text-red-600">Failed to save. Please try again.</p>
      )}
    </form>
  );
}
