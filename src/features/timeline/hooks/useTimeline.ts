import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { timelineAdapter } from '../services';
import type { PayoffStrategy } from '../services';

export const timelineKeys = {
  all: ['timeline'] as const,
  byStrategy: (strategy: PayoffStrategy, extra: number) =>
    ['timeline', strategy, extra] as const,
};

export function useTimeline() {
  const [strategy, setStrategy] = useState<PayoffStrategy>('avalanche');
  const [extraPayment, setExtraPayment] = useState(0);

  const query = useQuery({
    queryKey: timelineKeys.byStrategy(strategy, extraPayment),
    queryFn: () => timelineAdapter.get(strategy, extraPayment),
  });

  return { ...query, strategy, setStrategy, extraPayment, setExtraPayment };
}
