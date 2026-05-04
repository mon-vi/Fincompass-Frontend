import { useEffect, useRef } from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Alert } from '@/components/ui/Alert';
import { PremiumErrorAlert } from '@/components/ui/PremiumErrorAlert';
import { Skeleton } from '@/components/ui/Loader';
import { ChatBubble, UsageMeter } from '@/features/aria/components';
import { useAriaActiveConversation, useAriaUsage, useAriaInput } from '@/features/aria/hooks';
import { safeFormatDate } from '@/utils/formatters';

export function AriaPage() {
  const { messages, isLoading: historyLoading, isError: historyError, error: historyErrorValue } = useAriaActiveConversation();
  const { data: usage, isError: usageError } = useAriaUsage();
  const { input, setInput, submit, isPending, isError, error } = useAriaInput();

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const atLimit = usage ? usage.used >= usage.limit : false;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] min-h-[34rem] flex-col gap-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <SectionHeader
          title="ARIA"
          subtitle="Ask for plain-English financial guidance without leaving your plan."
        />
        {usage && <UsageMeter usage={usage} className="w-full shrink-0 lg:w-64" />}
      </div>

      {(historyError || usageError) && (
        <Alert variant="error">
          {(historyErrorValue as Error)?.message ?? 'ARIA is unavailable right now. Please try again.'}
        </Alert>
      )}

      {/* Message thread */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto rounded-[2rem] border border-slate-200 bg-white/95 p-4 shadow-sm shadow-slate-900/[0.04]"
      >
        {historyLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-3/4" />)}
          </div>
        ) : messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}
            {isPending && (
              <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-500">
                <span className="inline-flex gap-1">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:0ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]" />
                </span>
                <span>ARIA is thinking…</span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#12355b]/10">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-8 w-8 text-[#12355b]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
            </div>
            <p className="text-sm font-bold text-slate-800">Ask ARIA anything about your finances</p>
            <p className="max-w-md text-xs leading-5 text-slate-500">Debt payoff strategies, budgeting tips, savings goals, and more.</p>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="space-y-2">
        {isError && (
          <PremiumErrorAlert message={(error as Error)?.message ?? 'Failed to send message. Please try again.'} />
        )}

        {atLimit && (
          <Alert variant="warning">
            You've reached your monthly message limit{usage?.resetsAt ? ` for ${safeFormatDate(usage.resetsAt, { month: 'long', year: 'numeric' })}` : ''}.
          </Alert>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isPending || atLimit}
            rows={2}
            placeholder={atLimit ? 'Message limit reached' : 'Ask ARIA a question… (Enter to send, Shift+Enter for new line)'}
            className="min-h-24 flex-1 resize-none rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm shadow-slate-900/[0.03] placeholder:text-slate-400 focus:border-[#2b6d91] focus:outline-none focus:ring-4 focus:ring-[#2b6d91]/15 disabled:opacity-50 sm:min-h-0"
          />
          <button
            onClick={submit}
            disabled={!input.trim() || isPending || atLimit}
            className="min-h-12 rounded-2xl bg-[#12355b] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#0b2746] disabled:opacity-50 sm:self-end"
          >
            {isPending ? '…' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}
