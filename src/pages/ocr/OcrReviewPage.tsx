import { useNavigate, useParams } from 'react-router-dom';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { Skeleton } from '@/components/ui/Loader';
import { OcrExpenseRow } from '@/features/ocr/components';
import { useOcrSession, useOcrConfirm, useOcrSelection } from '@/features/ocr/hooks';
import { formatCurrency } from '@/utils/formatters';
import { ROUTES } from '@/constants/routes';

export function OcrReviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: session, isLoading, isError } = useOcrSession(id ?? null);
  const confirm = useOcrConfirm(id ?? null);

  const extractedIds = session?.extractedExpenses.map((e) => e.id) ?? [];
  const { selected, toggle, selectAll, clearAll } = useOcrSelection(extractedIds);

  const selectedExpenses = session?.extractedExpenses.filter((e) => selected.has(e.id)) ?? [];
  const selectedTotal = selectedExpenses.reduce((sum, e) => sum + e.amount, 0);

  const handleConfirm = () => {
    confirm.mutate(
      { selectedIds: [...selected] },
      {
        onSuccess: () => navigate(ROUTES.EXPENSES),
      },
    );
  };

  if (isError) {
    return (
      <div className="space-y-6">
        <SectionHeader title="Review extracted expenses" />
        <Alert variant="error">Failed to load OCR session. It may have expired.</Alert>
      </div>
    );
  }

  if (session?.status === 'confirmed') {
    return (
      <div className="space-y-6">
        <SectionHeader title="Already imported" />
        <Alert variant="success">This OCR session has already been confirmed and imported.</Alert>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <SectionHeader
        title="Review extracted expenses"
        subtitle="Select which expenses to import. Deselect any you want to skip."
      />

      {/* Session info */}
      {session && (
        <div className="flex flex-wrap items-center gap-4 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
          <span>File: <strong className="text-slate-800">{session.fileName}</strong></span>
          <span>{session.extractedExpenses.length} expenses found</span>
        </div>
      )}

      {/* Select/deselect controls */}
      {session && session.extractedExpenses.length > 0 && (
        <div className="flex items-center gap-3">
          <button onClick={selectAll} className="text-sm font-medium text-indigo-600 hover:underline">
            Select all
          </button>
          <span className="text-slate-300">|</span>
          <button onClick={clearAll} className="text-sm font-medium text-slate-500 hover:underline">
            Deselect all
          </button>
          <span className="ml-auto text-sm text-slate-500">
            {selected.size} selected · {formatCurrency(selectedTotal)}
          </span>
        </div>
      )}

      {/* Expense list */}
      <Card>
        <CardHeader>
          <CardTitle>Extracted expenses</CardTitle>
        </CardHeader>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-14 w-full" />)}
          </div>
        ) : session?.extractedExpenses.length === 0 ? (
          <div className="py-10 text-center text-sm text-slate-500">
            No expenses were extracted from this document.
          </div>
        ) : (
          <div className="space-y-2">
            {session?.extractedExpenses.map((expense) => (
              <OcrExpenseRow
                key={expense.id}
                expense={expense}
                selected={selected.has(expense.id)}
                onToggle={() => toggle(expense.id)}
              />
            ))}
          </div>
        )}
      </Card>

      {/* Footer actions */}
      {session && session.status !== 'failed' && (
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => navigate(ROUTES.EXPENSES)}
            className="text-sm font-medium text-slate-500 hover:underline"
          >
            Cancel
          </button>

          {confirm.isError && (
            <Alert variant="error" className="flex-1">
              {(confirm.error as Error)?.message ?? 'Import failed. Please try again.'}
            </Alert>
          )}

          <button
            disabled={selected.size === 0 || confirm.isPending}
            onClick={handleConfirm}
            className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {confirm.isPending ? 'Importing…' : `Import ${selected.size} expense${selected.size !== 1 ? 's' : ''}`}
          </button>
        </div>
      )}
    </div>
  );
}
