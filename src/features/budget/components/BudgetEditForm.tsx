import { useState } from 'react';
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
          <div key={cat.id} className="flex items-center gap-3">
            <span className="text-lg leading-none">{cat.icon}</span>
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-700">{cat.name}</span>
            <div className="relative w-32">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-slate-400">
                $
              </span>
              <input
                type="number"
                min="0"
                step="1"
                value={amounts[cat.id] ?? ''}
                onChange={(e) => setAmounts((prev) => ({ ...prev, [cat.id]: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 py-1.5 pl-7 pr-3 text-right text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 pt-3">
        <div className="text-sm text-slate-500">
          Total: <span className="font-semibold text-slate-800">{formatCurrency(newTotal)}</span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={update.isPending}
            className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {update.isPending ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      {update.isError && (
        <p className="text-xs text-red-600">Failed to save. Please try again.</p>
      )}
    </form>
  );
}
