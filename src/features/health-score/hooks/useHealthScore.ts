import { useQuery } from '@tanstack/react-query';
import { healthScoreAdapter } from '../services';

export const healthScoreKeys = {
  all: ['health-score'] as const,
};

export function useHealthScore() {
  return useQuery({
    queryKey: healthScoreKeys.all,
    queryFn: () => healthScoreAdapter.get(),
  });
}
