import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ariaAdapter } from '../services';
import type { AriaChatMessage, AriaConversation } from '../services';

export const ariaKeys = {
  conversations: ['aria', 'conversations'] as const,
  usage: ['aria', 'usage'] as const,
};

export function useAriaConversations() {
  return useQuery({
    queryKey: ariaKeys.conversations,
    queryFn: () => ariaAdapter.getConversations(),
  });
}

export function useAriaActiveConversation() {
  const conversations = useAriaConversations();
  return {
    ...conversations,
    conversation: conversations.data?.[0] ?? null,
    messages: conversations.data?.[0]?.messages ?? [],
  };
}

export function useAriaUsage() {
  return useQuery({
    queryKey: ariaKeys.usage,
    queryFn: () => ariaAdapter.getUsage(),
  });
}

export function useAriaSend() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) => {
      const conversations = qc.getQueryData<AriaConversation[]>(ariaKeys.conversations) ?? [];
      const conversation = conversations[0] ?? await ariaAdapter.createConversation();
      if (conversations.length === 0) {
        qc.setQueryData<AriaConversation[]>(ariaKeys.conversations, [conversation]);
      }
      return ariaAdapter.sendMessage({ conversationId: conversation.id, content });
    },

    onMutate: async (content: string) => {
      await qc.cancelQueries({ queryKey: ariaKeys.conversations });
      const previous = qc.getQueryData<AriaConversation[]>(ariaKeys.conversations);

      const optimisticMsg: AriaChatMessage = {
        id: `optimistic-${Date.now()}`,
        role: 'user',
        content,
        createdAt: new Date().toISOString(),
        status: 'sending',
      };

      qc.setQueryData<AriaConversation[]>(ariaKeys.conversations, (old = []) => {
        if (old[0]) {
          return [{ ...old[0], messages: [...old[0].messages, optimisticMsg] }, ...old.slice(1)];
        }
        return [{ id: 'pending-conversation', title: null, messages: [optimisticMsg], createdAt: '', updatedAt: '' }];
      });
      return { previous };
    },

    onSuccess: (result) => {
      qc.setQueryData<AriaConversation[]>(ariaKeys.conversations, (old = []) => {
        const target = old.find((conversation) => conversation.id === result.conversation.id) ?? old[0] ?? result.conversation;
        const withoutOptimistic = target.messages.filter((m) => !m.id.startsWith('optimistic-'));
        const updated = {
          ...target,
          ...result.conversation,
          messages: [...withoutOptimistic, ...result.messages],
        };
        const rest = old.filter((conversation) => conversation.id !== target.id && conversation.id !== 'pending-conversation');
        return [updated, ...rest];
      });
      qc.setQueryData(ariaKeys.usage, result.usage);
    },

    onError: (_error, _variables, context) => {
      if (context?.previous) {
        qc.setQueryData(ariaKeys.conversations, context.previous);
      }
    },
  });
}

export function useAriaInput() {
  const [input, setInput] = useState('');
  const send = useAriaSend();

  const submit = () => {
    const trimmed = input.trim();
    if (!trimmed || send.isPending) return;
    setInput('');
    send.mutate(trimmed);
  };

  return { input, setInput, submit, isPending: send.isPending, isError: send.isError, error: send.error };
}
