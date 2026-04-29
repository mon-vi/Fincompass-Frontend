import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { Skeleton } from '@/components/ui/Loader';
import { OcrExpenseRow } from '@/features/ocr/components';
import { useOcrSession, useOcrConfirm, useOcrAbandon, useOcrSelection } from '@/features/ocr/hooks';
import { formatCurrency } from '@/utils/formatters';
import { ROUTES } from '@/constants/routes';
import type { OcrExtractedItem } from '@/features/ocr/services';

export function OcrReviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: session, isLoading, isError } = useOcrSession(id ?? null);
  const confirm = useOcrConfirm(id ?? null);
  const abandon = useOcrAbandon(id ?? null);
  const [draftItems, setDraftItems] = useState<OcrExtractedItem[]>([]);

  useEffect(() => {
    setDraftItems(session?.extractedItems ?? []);
  }, [session?.id, session?.extractedItems]);

  const extractedIds = draftItems.map((item) => item.id);
  const { selected, toggle, selectAll, clearAll } = useOcrSelection(extractedIds);

  const selectedItems = draftItems.filter((item) => selected.has(item.id));
  const selectedTotal = selectedItems.reduce((sum, item) => sum + item.amount, 0);

  const updateDraftItem = (updated: OcrExtractedItem) => {
    setDraftItems((items) => items.map((item) => (item.id === updated.id ? updated : item)));
  };

  const handleConfirm = () => {
    confirm.mutate(
      { items: selectedItems },
      {
        onSuccess: () => navigate(ROUTES.EXPENSES),
      },
    );
  };

  const handleAbandon = () => {
    abandon.mutate(undefined, {
      onSuccess: () => navigate(ROUTES.EXPENSES),
    });
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

  if (session?.status === 'failed') {
    return (
      <div className="space-y-6">
        <SectionHeader title="OCR failed" />
        <Alert variant="error">{session.errorMessage ?? 'OCR processing failed. Please upload a different document.'}</Alert>
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
          <span>{draftItems.length} item{draftItems.length !== 1 ? 's' : ''} found</span>
        </div>
      )}

      {/* Select/deselect controls */}
      {session && draftItems.length > 0 && (
        <div className="flex items-center gap-3">
          <button onClick={selectAll} className="text-sm font-medium text-indigo-600 hover:underline">
            Select all
          </button>
          <span className="text-slate-300">|</span>
          <button onClick={clearAll} className="text-sm font-medium text-slate-500 hover:underline">
            Deselect all
          </button>
          <span className="ml-auto text-sm text-slate-500">
            {selected.size} selected - {formatCurrency(selectedTotal)}
          </span>
        </div>
      )}

      {/* Expense list */}
      <Card>
        <CardHeader>
          <CardTitle>Extracted items</CardTitle>
        </CardHeader>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-14 w-full" />)}
          </div>
        ) : draftItems.length === 0 ? (
          <div className="py-10 text-center text-sm text-slate-500">
            No expenses or debts were extracted from this document.
          </div>
        ) : (
          <div className="space-y-2">
            {draftItems.map((item) => (
              <OcrExpenseRow
                key={item.id}
                item={item}
                selected={selected.has(item.id)}
                onToggle={() => toggle(item.id)}
                onChange={updateDraftItem}
              />
            ))}
          </div>
        )}
      </Card>

      {/* Footer actions */}
      {session && session.status !== 'failed' && (
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={handleAbandon}
            disabled={abandon.isPending || confirm.isPending}
            className="text-sm font-medium text-slate-500 hover:underline disabled:opacity-50"
          >
            {abandon.isPending ? 'Abandoning...' : 'Abandon'}
          </button>

          {(confirm.isError || abandon.isError) && (
            <Alert variant="error" className="flex-1">
              {(confirm.error as Error)?.message ?? (abandon.error as Error)?.message ?? 'OCR action failed. Please try again.'}
            </Alert>
          )}

          <button
            disabled={selected.size === 0 || confirm.isPending || abandon.isPending}
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
