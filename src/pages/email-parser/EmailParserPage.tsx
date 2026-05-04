import { useState } from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { PremiumErrorAlert } from '@/components/ui/PremiumErrorAlert';
import { Skeleton } from '@/components/ui/Loader';
import { useApplyEmailParserEvent, useDismissEmailParserEvent, useEmailParserEvents, useEmailParserForwardingAddress } from '@/features/email-parser/hooks';
import { safeFormatDate } from '@/utils/formatters';
import type { EmailParserEvent } from '@/features/email-parser/services';

function formatParsedData(parsedData: Record<string, unknown>) {
  const entries = Object.entries(parsedData).slice(0, 4);
  if (entries.length === 0) return 'No parsed fields returned.';
  return entries.map(([key, value]) => `${key.replaceAll('_', ' ')}: ${String(value)}`).join(' | ');
}

function eventBadge(event: EmailParserEvent) {
  if (event.status === 'matched') return <Badge variant="success">Matched</Badge>;
  if (event.status === 'applied') return <Badge variant="success">Applied</Badge>;
  if (event.status === 'dismissed' || event.status === 'ignored') return <Badge variant="default">Dismissed</Badge>;
  if (event.status === 'failed') return <Badge variant="danger">Failed</Badge>;
  return <Badge variant="warning">Unmatched</Badge>;
}

export function EmailParserPage() {
  const forwardingAddress = useEmailParserForwardingAddress();
  const events = useEmailParserEvents();
  const apply = useApplyEmailParserEvent();
  const dismiss = useDismissEmailParserEvent();
  const [notice, setNotice] = useState<string | null>(null);

  const handleApply = (event: EmailParserEvent) => {
    setNotice(null);
    apply.mutate({ id: event.id }, { onSuccess: () => setNotice('Email event applied successfully.') });
  };

  const handleDismiss = (event: EmailParserEvent) => {
    setNotice(null);
    dismiss.mutate(event.id, { onSuccess: () => setNotice('Email event dismissed.') });
  };

  const actionError = (apply.error as Error)?.message ?? (dismiss.error as Error)?.message;

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Email Parser"
        subtitle="Forward receipts or statements, then review parsed finance events before they touch your records."
      />

      <Card className="bg-gradient-to-br from-white to-slate-50">
        <CardHeader>
          <CardTitle>Forwarding address</CardTitle>
        </CardHeader>
        {forwardingAddress.isLoading ? (
          <Skeleton className="h-8 w-72" />
        ) : forwardingAddress.isError ? (
          <PremiumErrorAlert message={(forwardingAddress.error as Error)?.message ?? 'Failed to load forwarding address.'} />
        ) : forwardingAddress.data ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 font-mono text-sm font-semibold text-slate-800 shadow-sm shadow-slate-900/[0.03]">
            {forwardingAddress.data.address}
          </div>
        ) : (
          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600 ring-1 ring-slate-200/70">
            No forwarding address is set up yet. Create one from the backend or account setup flow before forwarding emails.
          </div>
        )}
      </Card>

      {notice && <Alert variant="success">{notice}</Alert>}
      {actionError && <PremiumErrorAlert message={actionError} />}

      <Card>
        <CardHeader>
          <CardTitle>Parsed events</CardTitle>
        </CardHeader>

        {events.isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((item) => <Skeleton key={item} className="h-24 w-full" />)}
          </div>
        ) : events.isError ? (
          <PremiumErrorAlert message={(events.error as Error)?.message ?? 'Failed to load parsed events.'} />
        ) : events.data && events.data.length > 0 ? (
          <div className="space-y-3">
            {events.data.map((event) => {
              const disabled = ['applied', 'dismissed', 'ignored'].includes(event.status);
              return (
                <div key={event.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-900/[0.03]">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {eventBadge(event)}
                        {event.matchedType && <Badge variant="default">{event.matchedType}</Badge>}
                      </div>
                      <p className="mt-2 truncate text-sm font-bold text-slate-950">{event.subject ?? 'No subject'}</p>
                      <p className="text-xs text-slate-500">
                        {event.sender ?? 'Unknown sender'}{event.receivedAt ? ` - ${safeFormatDate(event.receivedAt, { dateStyle: 'short', timeStyle: 'short' })}` : ''}
                      </p>
                      <p className="mt-3 rounded-2xl bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-600 ring-1 ring-slate-200/70">{formatParsedData(event.parsedData)}</p>
                      {event.errorMessage && <p className="mt-2 text-xs text-red-600">{event.errorMessage}</p>}
                    </div>

                    <div className="flex shrink-0 gap-2 sm:flex-col lg:flex-row">
                      <Button size="sm" onClick={() => handleApply(event)} disabled={disabled || apply.isPending} isLoading={apply.isPending && apply.variables?.id === event.id}>
                        Apply
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDismiss(event)} disabled={disabled || dismiss.isPending} isLoading={dismiss.isPending && dismiss.variables === event.id}>
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-10 text-center text-sm text-slate-500">
            <p className="font-semibold text-slate-700">No parsed email events yet.</p>
            <p className="mt-1">Forward a supported receipt or statement to the address above.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
