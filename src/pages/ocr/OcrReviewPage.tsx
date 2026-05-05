import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { PremiumErrorAlert } from '@/components/ui/PremiumErrorAlert';
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
  const [draftSessionId, setDraftSessionId] = useState<string | null>(null);
  const [draftItems, setDraftItems] = useState<OcrExtractedItem[]>([]);

  if (session?.id && session.id !== draftSessionId) {
    setDraftSessionId(session.id);
    setDraftItems(session?.extractedItems ?? []);
  }

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
        onSuccess: () => navigate(ROUTES.DEBTS),
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
        <Alert variant="error" title="Review session did not load">This import may have expired. Upload the document again when you are ready.</Alert>
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
        <Alert variant="error" title="Document could not be read">{session.errorMessage ?? 'Upload a clearer or different document and try again.'}</Alert>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <SectionHeader
        title="Review extracted expenses"
        subtitle="Review what FinCompass found. Select only the items you trust before importing."
      />

      {/* Session info */}
      {session && (
        <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-600 shadow-sm shadow-slate-900/[0.03]">
          <span>File: <strong className="text-slate-800">{session.fileName}</strong></span>
          <span>{draftItems.length} item{draftItems.length !== 1 ? 's' : ''} found</span>
        </div>
      )}

      {/* Select/deselect controls */}
      {session && draftItems.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200/70">
          <button type="button" onClick={selectAll} className="rounded-lg px-2 py-1 text-sm font-bold text-[#2b6d91] hover:bg-white hover:text-[#12355b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2b6d91]">
            Select all
          </button>
          <span className="text-slate-300">|</span>
          <button type="button" onClick={clearAll} className="rounded-lg px-2 py-1 text-sm font-bold text-slate-500 hover:bg-white hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2b6d91]">
            Deselect all
          </button>
          <span className="ml-auto text-sm font-semibold text-slate-600">
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
          <EmptyState title="No items found" description="We did not find expenses or debts in this document. Try a clearer image or another supported file." />
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
      {session && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={handleAbandon}
            disabled={abandon.isPending || confirm.isPending}
          >
            {abandon.isPending ? 'Abandoning...' : 'Abandon'}
          </Button>

          {(confirm.isError || abandon.isError) && (
            <PremiumErrorAlert
              className="flex-1"
              message={(confirm.error as Error)?.message ?? (abandon.error as Error)?.message ?? 'That OCR action did not finish. Check your connection and try again.'}
            />
          )}

          <Button
            type="button"
            disabled={selected.size === 0 || confirm.isPending || abandon.isPending}
            onClick={handleConfirm}
            isLoading={confirm.isPending}
            className="w-full sm:w-auto"
          >
            {confirm.isPending ? 'Importing...' : `Import ${selected.size} item${selected.size !== 1 ? 's' : ''}`}
          </Button>
        </div>
      )}
    </div>
  );
}
