import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { emailParserAdapter } from '../services';
import { invalidateFinancialQueries } from '@/features/finance/invalidateFinancialQueries';
import type { ApplyEmailParserEventPayload } from '../services';

export const emailParserKeys = {
  forwardingAddress: ['email-parser', 'forwarding-address'] as const,
  events: ['email-parser', 'events'] as const,
  event: (id: string) => ['email-parser', 'events', id] as const,
};

export function useEmailParserForwardingAddress() {
  return useQuery({
    queryKey: emailParserKeys.forwardingAddress,
    queryFn: () => emailParserAdapter.getForwardingAddress(),
  });
}

export function useEmailParserEvents() {
  return useQuery({
    queryKey: emailParserKeys.events,
    queryFn: () => emailParserAdapter.listEvents(),
  });
}

export function useEmailParserEvent(id: string | null) {
  return useQuery({
    queryKey: emailParserKeys.event(id ?? ''),
    queryFn: () => emailParserAdapter.getEvent(id!),
    enabled: !!id,
  });
}

export function useApplyEmailParserEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload?: ApplyEmailParserEventPayload }) => emailParserAdapter.applyEvent(id, payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: emailParserKeys.events });
      invalidateFinancialQueries(qc);
    },
  });
}

export function useDismissEmailParserEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => emailParserAdapter.dismissEvent(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: emailParserKeys.events });
    },
  });
}
