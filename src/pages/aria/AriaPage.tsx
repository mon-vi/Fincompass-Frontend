import { useEffect, useRef } from 'react';
import { Alert } from '@/components/ui/Alert';
import { PremiumErrorAlert } from '@/components/ui/PremiumErrorAlert';
import { Skeleton } from '@/components/ui/Loader';
import { ChatBubble, UsageMeter } from '@/features/aria/components';
import { useAriaActiveConversation, useAriaUsage, useAriaInput } from '@/features/aria/hooks';
import { safeFormatDate } from '@/utils/formatters';

function SendIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
      <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
    </svg>
  );
}

export function AriaPage() {
  const { messages, isLoading: historyLoading, isError: historyError, error: historyErrorValue } = useAriaActiveConversation();
  const { data: usage, isError: usageError } = useAriaUsage();
  const { input, setInput, submit, isPending, isError, error } = useAriaInput();

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  const handleSubmit = () => {
    submit();
    textareaRef.current?.focus();
  };

  return (
    /* Full viewport height minus mobile top bar (3.5rem) and bottom nav (3.75rem + safe area) */
    <div className="flex flex-col" style={{ height: 'calc(100svh - 3.5rem - var(--content-bottom-pad, 3.75rem))' }}>
      {/* Header */}
      <div className="shrink-0 space-y-3 pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">ARIA</h1>
            <p className="mt-1 text-sm text-slate-500">Ask for plain-English financial guidance.</p>
          </div>
          {usage && <UsageMeter usage={usage} className="w-full shrink-0 sm:w-64" />}
        </div>

        {(historyError || usageError) && (
          <Alert variant="error">
            {(historyErrorValue as Error)?.message ?? 'ARIA is unavailable right now. Please try again.'}
          </Alert>
        )}
      </div>

      {/* Message thread – scrollable */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto rounded-[1.5rem] border border-slate-200 bg-white/95 p-4 shadow-sm shadow-slate-900/[0.04]"
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
              <div className="flex w-fit items-center gap-2 rounded-2xl bg-slate-100 px-3 py-2 text-sm text-slate-500">
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
          <div className="flex h-full flex-col items-center justify-center gap-3 px-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#12355b]/10">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-8 w-8 text-[#12355b]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Ask ARIA anything about your finances</p>
              <p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">Debt payoff strategies, budgeting tips, savings goals, and more.</p>
            </div>
          </div>
        )}
      </div>

      {/* Fixed input area at bottom */}
      <div className="shrink-0 space-y-2 pt-3">
        {isError && (
          <PremiumErrorAlert message={(error as Error)?.message ?? 'Failed to send message. Please try again.'} />
        )}
        {atLimit && (
          <Alert variant="warning">
            You've reached your monthly message limit{usage?.resetsAt ? ` for ${safeFormatDate(usage.resetsAt, { month: 'long', year: 'numeric' })}` : ''}.
          </Alert>
        )}

        <div className="flex items-end gap-2 rounded-2xl border border-slate-300 bg-white p-2 shadow-sm shadow-slate-900/[0.03] focus-within:border-[#2b6d91] focus-within:ring-4 focus-within:ring-[#2b6d91]/10">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isPending || atLimit}
            rows={1}
            placeholder={atLimit ? 'Message limit reached' : 'Ask ARIA… (Enter to send)'}
            className="max-h-32 min-h-[2.5rem] flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none disabled:opacity-50"
            style={{ fieldSizing: 'content' } as React.CSSProperties}
          />
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || isPending || atLimit}
            aria-label="Send message"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#12355b] text-white transition hover:bg-[#0b2746] disabled:opacity-40"
          >
            <SendIcon />
          </button>
        </div>
        <p className="text-center text-[10px] text-slate-400">Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  );
}
