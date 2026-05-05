import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
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
        <Alert variant="error" title="Expenses did not load">
          {(error as Error)?.message ?? 'We could not load your spending yet. Check your connection and try again.'}
        </Alert>
      </div>
    );
  }

  return (
      <div className="space-y-6 sm:space-y-8">
      <SectionHeader
        title="Expenses"
        subtitle="Track spending without turning every receipt into homework."
      />

      <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-5 shadow-sm shadow-slate-900/[0.04] sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2b6d91]">Total this month</p>
          <p className="mt-1 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{formatCurrency(totalSpent)}</p>
          <p className="mt-1 text-sm text-slate-500">Manual, OCR, and email-imported spending show up together.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          {canUseOcr ? (
            <Link
              to={ROUTES.OCR_UPLOAD}
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#2b6d91]/30 bg-[#2b6d91]/10 px-4 py-2 text-sm font-bold text-[#12355b] hover:bg-[#2b6d91]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2b6d91] focus-visible:ring-offset-2"
            >
              Import via OCR
            </Link>
          ) : (
            <Link
              to={ROUTES.BILLING}
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2b6d91] focus-visible:ring-offset-2"
            >
              OCR requires Navigator+
            </Link>
          )}
          <Button
            type="button"
            variant="accent"
            onClick={() => { setShowAdd(true); setEditing(null); }}
          >
            Add expense
          </Button>
        </div>
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
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">{expenses.length} items</span>
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
          <EmptyState
            title="No expenses yet"
            description="Add one manually or import a receipt when you are ready. Your spending picture will build from here."
            action={<Button type="button" variant="accent" onClick={() => setShowAdd(true)}>Add your first expense</Button>}
          />
        )}
      </Card>
    </div>
  );
}
