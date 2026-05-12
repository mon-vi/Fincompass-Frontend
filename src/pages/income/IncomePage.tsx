import { useState } from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { Skeleton } from '@/components/ui/Loader';
import { useIncome, useCreateIncome, useUpdateIncome } from '@/features/income/hooks';
import { IncomeForm, IncomeRow } from '@/features/income/components';
import { formatCurrency } from '@/utils/formatters';
import { useSuccessMessage } from '@/hooks';
import type { IncomeRecord } from '@/features/income/services';
import type { IncomeFormData } from '@/features/income/validation';

export function IncomePage() {
  const { data: incomeList, isLoading, isError, error } = useIncome();
  const createIncome = useCreateIncome();
  const updateIncome = useUpdateIncome();

  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<IncomeRecord | null>(null);
  const { message: successMessage, show: showSuccess } = useSuccessMessage();

  const handleCreate = (data: IncomeFormData) => {
    createIncome.mutate(
      { ...data, amount: Number(data.amount) },
      { onSuccess: () => { setShowAdd(false); showSuccess('Saved. Recalculating your plan…'); } },
    );
  };

  const handleUpdate = (data: IncomeFormData) => {
    if (!editing) return;
    updateIncome.mutate(
      { id: editing.id, payload: { ...data, amount: Number(data.amount) } },
      { onSuccess: () => { setEditing(null); showSuccess('Saved. Recalculating your plan…'); } },
    );
  };

  const monthlyTotal = incomeList?.reduce((sum, r) => sum + r.monthlyAmount, 0) ?? 0;

  if (isError) {
    return (
      <div className="space-y-6">
        <SectionHeader title="Income" />
        <Alert variant="error">{(error as Error)?.message ?? 'Failed to load income sources'}</Alert>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Income"
        subtitle="Track all income sources so your budget and cash flow stay accurate."
      />

      {successMessage && (
        <Alert variant="success">{successMessage}</Alert>
      )}

      {/* Monthly total hero */}
      <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-5 shadow-sm shadow-slate-900/[0.04] sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Monthly total</p>
            <p className="mt-1 text-4xl font-black tracking-tight text-slate-950">
              {isLoading ? '—' : formatCurrency(monthlyTotal)}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Combined monthly equivalent across all active income sources.
            </p>
          </div>
          <button
            onClick={() => { setShowAdd(true); setEditing(null); }}
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#d97735] px-4 py-2 text-sm font-bold text-white shadow-sm shadow-orange-900/10 hover:bg-[#bf6428]"
          >
            Add income
          </button>
        </div>
      </div>

      {/* Add / Edit form */}
      {(showAdd || editing) && (
        <Card>
          <CardHeader>
            <CardTitle>{editing ? 'Edit income source' : 'New income source'}</CardTitle>
          </CardHeader>
          <IncomeForm
            defaultValues={editing ? {
              sourceName: editing.sourceName,
              type: editing.type,
              amount: editing.amount,
              frequency: editing.frequency,
            } : undefined}
            onSubmit={editing ? handleUpdate : handleCreate}
            onCancel={() => { setShowAdd(false); setEditing(null); }}
            isSubmitting={createIncome.isPending || updateIncome.isPending}
            submitError={createIncome.error ?? updateIncome.error}
            submitLabel={editing ? 'Update' : 'Add income'}
          />
        </Card>
      )}

      {/* Income list */}
      <Card>
        <CardHeader>
          <CardTitle>Income sources</CardTitle>
          {incomeList && (
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">
              {incomeList.length} source{incomeList.length !== 1 ? 's' : ''}
            </span>
          )}
        </CardHeader>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 w-full" />)}
          </div>
        ) : incomeList && incomeList.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {incomeList.map((record) => (
              <IncomeRow
                key={record.id}
                record={record}
                onEdit={(r) => { setEditing(r); setShowAdd(false); }}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-12 text-center">
            <p className="text-sm font-semibold text-slate-700">No income sources yet.</p>
            <p className="mt-1 text-sm text-slate-500">Add your salary, freelance work, or any other income.</p>
            <button
              onClick={() => setShowAdd(true)}
              className="mt-4 inline-flex min-h-10 items-center justify-center rounded-xl bg-white px-4 text-sm font-bold text-[#2b6d91] ring-1 ring-slate-200 hover:bg-slate-50"
            >
              Add your first income source
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}
