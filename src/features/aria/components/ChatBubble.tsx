import { cn } from '@/utils/cn';
import { safeFormatDate } from '@/utils/formatters';
import type { AriaChatMessage } from '../services';

interface ChatBubbleProps {
  message: AriaChatMessage;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === 'user';
  const isOptimistic = message.id.startsWith('optimistic-');

  return (
    <div className={cn('flex gap-3', isUser ? 'flex-row-reverse' : 'flex-row')}>
      {/* Avatar */}
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
          isUser ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600',
        )}
      >
        {isUser ? 'You' : 'AI'}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          'max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
          isUser
            ? 'rounded-tr-sm bg-indigo-600 text-white'
            : 'rounded-tl-sm bg-slate-100 text-slate-800',
          isOptimistic && 'opacity-60',
        )}
      >
        {/* Render simple markdown bold (**text**) */}
        <MessageContent content={message.content} />
        <p className={cn('mt-1 text-[10px]', isUser ? 'text-indigo-200' : 'text-slate-400')}>
          {safeFormatDate(message.createdAt, { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}

function MessageContent({ content }: { content: string }) {
  // Split on **bold** markers and render inline
  const parts = content.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={i}>{part.slice(2, -2)}</strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </span>
  );
}
