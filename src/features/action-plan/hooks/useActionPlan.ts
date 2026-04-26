import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { actionPlanAdapter } from '../services';
import type { UpdateActionItemPayload } from '../services';

export const actionPlanKeys = {
  all: ['action-plan'] as const,
};

export function useActionPlan() {
  return useQuery({
    queryKey: actionPlanKeys.all,
    queryFn: () => actionPlanAdapter.list(),
  });
}

export function useToggleActionItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateActionItemPayload }) =>
      actionPlanAdapter.update(id, payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: actionPlanKeys.all });
    },
  });
}
