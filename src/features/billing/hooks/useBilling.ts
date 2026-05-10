import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { billingAdapter } from '../services';
import type { CheckoutPayload } from '../services';

export const billingKeys = {
  subscription: ['billing', 'subscription'] as const,
};

export function useBillingSubscription(options?: { refetchInterval?: number | false }) {
  return useQuery({
    queryKey: billingKeys.subscription,
    queryFn: () => billingAdapter.getSubscription(),
    refetchInterval: options?.refetchInterval,
  });
}

export function useBillingCheckout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CheckoutPayload) => billingAdapter.createCheckout(payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: billingKeys.subscription });
    },
  });
}

export function useBillingPortal() {
  return useMutation({
    mutationFn: () => billingAdapter.createPortal(),
  });
}
