import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { ROUTES } from '@/constants/routes';
import { dashboardKeys } from '@/features/dashboard/hooks';
import { useOnboardingStore } from '../store/onboardingStore';
import { generatePostOnboardingArtifacts, onboardingAdapter } from '../services';
import { buildOnboardingIncomePayload, incomeAdapter } from '@/features/income/services';
import { buildOnboardingDebtPayload, debtsAdapter } from '@/features/debts/services';
import { buildOnboardingExpensePayload, expensesAdapter } from '@/features/expenses/services';
import type { AdvancePayload } from '../services';
import type { Step1Data, Step2Data, Step3Data, Step4Data } from '../validation';

export function useOnboarding() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((s) => s.updateUser);

  const { currentStep, goBack, step1, step2, step3, saveStep1, saveStep2, saveStep3, saveStep4, reset } =
    useOnboardingStore();

  // Step 2 must create an income record first; the backend gates advancing
  // from income setup on at least one active income source existing.
  const advanceMutation = useMutation({
    mutationFn: async (payload: AdvancePayload) => {
      if (payload.step === 2) {
        await incomeAdapter.create(buildOnboardingIncomePayload(payload.data));
      }
      if (payload.step === 3) {
        const debt = buildOnboardingDebtPayload(payload.data);
        if (debt) await debtsAdapter.create(debt);
      }
      if (payload.step === 4) {
        const expenses = buildOnboardingExpensePayload(payload.data);
        if (expenses.expenses.length > 0) await expensesAdapter.bulkCreate(expenses);
      }

      const result = await onboardingAdapter.advance(payload);
      if (result.onboardingStatus === 'complete') {
        await generatePostOnboardingArtifacts({ hasDebts: useOnboardingStore.getState().step3?.hasDebts ?? false });
      }
      return result;
    },
    onSuccess: (result) => {
      if (result.onboardingStatus === 'complete') {
        updateUser({ onboardingStatus: 'complete' });
        void queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
        reset();
        navigate(ROUTES.DASHBOARD, { replace: true });
      } else {
        useOnboardingStore.getState().goNext();
      }
    },
  });

  const handleStep1Complete = (data: Step1Data) => {
    saveStep1(data);
    advanceMutation.mutate({ step: 1, data });
  };

  const handleStep2Complete = (data: Step2Data) => {
    saveStep2(data);
    advanceMutation.mutate({ step: 2, data });
  };

  const handleStep3Complete = (data: Step3Data) => {
    saveStep3(data);
    advanceMutation.mutate({ step: 3, data });
  };

  const handleStep4Complete = (data: Step4Data) => {
    saveStep4(data);
    advanceMutation.mutate({ step: 4, data });
  };

  return {
    currentStep,
    goBack,
    handleStep1Complete,
    handleStep2Complete,
    handleStep3Complete,
    handleStep4Complete,
    isSubmitting: advanceMutation.isPending,
    submitError: advanceMutation.error instanceof Error ? advanceMutation.error : null,
    step1,
    step2,
    step3,
    step4: useOnboardingStore.getState().step4,
  };
}
