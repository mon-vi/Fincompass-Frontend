import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { Skeleton } from '@/components/ui/Loader';
import { useExpenses, useCreateExpense, useUpdateExpense } from '@/features/expenses/hooks';
import { ExpenseRow, ExpenseForm } from '@/features/expenses/components';
import { formatCurrency } from '@/utils/formatters';
import { ROUTES } from '@/constants/routes';
import { useTierAccess } from '@/hooks';
import type { Expense } from '@/features/expenses/services';
import type { ExpenseFormData } from '@/features/expenses/validation';

export function ExpensesPage() {
  const { data: expenses, isLoading, isError, error } = useExpenses();
  const createExpense = useCreateExpense();
  const updateExpense = useUpdateExpense();
  const canUseOcr = useTierAccess('navigator');

  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);

  const handleCreate = (data: ExpenseFormData) => {
    createExpense.mutate(
      { ...data, amount: Number(data.amount) },
      { onSuccess: () => setShowAdd(false) },
    );
  };

  const handleUpdate = (data: ExpenseFormData) => {
    if (!editing) return;
    updateExpense.mutate(
      { id: editing.id, payload: { ...data, amount: Number(data.amount) } },
      { onSuccess: () => setEditing(null) },
    );
  };

  const totalSpent = expenses?.reduce((sum, e) => sum + e.amount, 0) ?? 0;

  if (isError) {
    return (
      <div className="space-y-6">
        <SectionHeader title="Expenses" />
        <Alert variant="error">{(error as Error)?.message ?? 'Failed to load expenses'}</Alert>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Expenses"
        subtitle="Track and manage your spending"
      />

      {/* Summary + actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Total this month</p>
          <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalSpent)}</p>
        </div>
        <div className="flex gap-2">
          {canUseOcr ? (
            <Link
              to={ROUTES.OCR_UPLOAD}
              className="rounded-lg border border-indigo-300 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
            >
              Import via OCR
            </Link>
          ) : (
            <Link
              to={ROUTES.BILLING}
              className="rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              OCR requires Navigator+
            </Link>
          )}
          <button
            onClick={() => { setShowAdd(true); setEditing(null); }}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            + Add expense
          </button>
        </div>
      </div>

      {/* Add / Edit form */}
      {(showAdd || editing) && (
        <Card>
          <CardHeader>
            <CardTitle>{editing ? 'Edit expense' : 'New expense'}</CardTitle>
          </CardHeader>
          <ExpenseForm
            defaultValues={editing ? {
              amount: editing.amount,
              category: editing.category,
              description: editing.description,
              date: editing.date,
              isRecurring: editing.isRecurring,
            } : undefined}
            onSubmit={editing ? handleUpdate : handleCreate}
            onCancel={() => { setShowAdd(false); setEditing(null); }}
            isSubmitting={createExpense.isPending || updateExpense.isPending}
            submitError={createExpense.error ?? updateExpense.error}
            submitLabel={editing ? 'Update' : 'Add expense'}
          />
        </Card>
      )}

      {/* Expense list */}
      <Card>
        <CardHeader>
          <CardTitle>All expenses</CardTitle>
          {expenses && (
            <span className="text-sm text-slate-400">{expenses.length} items</span>
          )}
        </CardHeader>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-14 w-full" />)}
          </div>
        ) : expenses && expenses.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {expenses.map((expense) => (
              <ExpenseRow
                key={expense.id}
                expense={expense}
                onEdit={(e) => { setEditing(e); setShowAdd(false); }}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-sm text-slate-500">No expenses yet.</p>
            <button
              onClick={() => setShowAdd(true)}
              className="mt-3 text-sm font-medium text-indigo-600 hover:underline"
            >
              Add your first expense
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}
