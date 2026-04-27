import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ariaAdapter } from '../services';
import type { AriaChatMessage } from '../services';

export const ariaKeys = {
  history: ['aria', 'history'] as const,
  usage: ['aria', 'usage'] as const,
};

export function useAriaHistory() {
  return useQuery({
    queryKey: ariaKeys.history,
    queryFn: () => ariaAdapter.getHistory(),
  });
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
    mutationFn: (content: string) => ariaAdapter.sendMessage({ content }),

    onMutate: async (content: string) => {
      await qc.cancelQueries({ queryKey: ariaKeys.history });
      const previous = qc.getQueryData<AriaChatMessage[]>(ariaKeys.history);

      const optimisticMsg: AriaChatMessage = {
        id: `optimistic-${Date.now()}`,
        role: 'user',
        content,
        createdAt: new Date().toISOString(),
      };

      qc.setQueryData<AriaChatMessage[]>(ariaKeys.history, (old = []) => [...old, optimisticMsg]);
      return { previous };
    },

    onSuccess: (result) => {
      qc.setQueryData<AriaChatMessage[]>(ariaKeys.history, (old = []) => {
        // Replace optimistic message + append assistant reply
        const withoutOptimistic = old.filter((m) => !m.id.startsWith('optimistic-'));
        const lastUser: AriaChatMessage = {
          id: String(Date.now()),
          role: 'user',
          content: old.find((m) => m.id.startsWith('optimistic-'))?.content ?? '',
          createdAt: new Date().toISOString(),
        };
        return [...withoutOptimistic, lastUser, result.message];
      });
      qc.setQueryData(ariaKeys.usage, result.usage);
    },

    onError: (_error, _variables, context) => {
      if (context?.previous) {
        qc.setQueryData(ariaKeys.history, context.previous);
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

  return { input, setInput, submit, isPending: send.isPending, isError: send.isError };
}
