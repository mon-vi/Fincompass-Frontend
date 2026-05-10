import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { budgetAdapter } from '../services';
import type { UpdateBudgetPayload } from '../services';

export const budgetKeys = {
  all: ['budget'] as const,
};

export function useBudget() {
  return useQuery({
    queryKey: budgetKeys.all,
    queryFn: () => budgetAdapter.get(),
  });
}

export function useCalculateBudget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => budgetAdapter.calculate(),
    onSuccess: (calculated) => {
      qc.setQueryData(budgetKeys.all, calculated);
      void qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useUpdateBudget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateBudgetPayload) => budgetAdapter.update(payload),
    onSuccess: (updated) => {
      qc.setQueryData(budgetKeys.all, updated);
    },
  });
}
