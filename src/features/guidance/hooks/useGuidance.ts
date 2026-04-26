import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { guidanceAdapter } from '../services';

export const guidanceKeys = {
  all: ['guidance'] as const,
};

export function useGuidance() {
  return useQuery({
    queryKey: guidanceKeys.all,
    queryFn: () => guidanceAdapter.list(),
  });
}

export function useDismissGuidance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => guidanceAdapter.dismiss(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: guidanceKeys.all });
    },
  });
}
