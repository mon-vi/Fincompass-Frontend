import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { ENV } from '@/constants/env';
import { ROUTES } from '@/constants/routes';
import { dashboardKeys } from '@/features/dashboard/hooks';
import { useOnboardingStore } from '../store/onboardingStore';
import { generatePostOnboardingArtifacts, onboardingAdapter } from '../services';
import { buildOnboardingIncomePayload, incomeAdapter } from '@/features/income/services';
import { buildOnboardingDebtPayload, debtsAdapter } from '@/features/debts/services';
import { buildOnboardingExpensePayload, expensesAdapter } from '@/features/expenses/services';
import type { AdvancePayload, AdvanceResponse } from '../services';
import type { Step1Data, Step2Data, Step3Data, Step4Data } from '../validation';

// Step 5 is a local-only "Review" step. It has no data payload — it reads
// from the store and calls advance({ step: 4 }) to signal completion.
type ExtendedPayload = AdvancePayload | { step: 5 };

function devLog(label: string, data?: unknown) {
  if (ENV.IS_DEV) {
    console.log(`[Onboarding] ${label}`, data ?? '');
  }
}

function devWarn(label: string, err?: unknown) {
  if (ENV.IS_DEV) {
    console.warn(`[Onboarding] ${label}`, err ?? '');
  }
}

export function useOnboarding() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((s) => s.updateUser);

  const { currentStep, goBack, step1, step2, step3, saveStep1, saveStep2, saveStep3, saveStep4, reset } =
    useOnboardingStore();

  const advanceMutation = useMutation({
    mutationFn: async (payload: ExtendedPayload): Promise<AdvanceResponse> => {
      devLog(`step ${payload.step} → advance payload`, payload);

      if (payload.step === 2) {
        const incomePayload = buildOnboardingIncomePayload(payload.data);
        devLog('step 2 → POST /income payload', incomePayload);
        const incomeResult = await incomeAdapter.create(incomePayload);
        devLog('step 2 → POST /income response', incomeResult);
      }

      if (payload.step === 3) {
        const debt = buildOnboardingDebtPayload(payload.data);
        if (debt) {
          devLog('step 3 → POST /debts payload', debt);
          const debtResult = await debtsAdapter.create(debt);
          devLog('step 3 → POST /debts response', debtResult);
        } else {
          devLog('step 3 → no debts to persist (hasDebts=false or balance=0)');
        }
      }

      if (payload.step === 4) {
        // Save expenses locally then advance to review — do NOT call /onboarding/advance yet.
        // The advance happens at step 5 (Review → Finish Setup).
        const expenses = buildOnboardingExpensePayload(payload.data);
        if (expenses.expenses.length > 0) {
          devLog('step 4 → POST /expenses/bulk payload', expenses);
          const expenseResult = await expensesAdapter.bulkCreate(expenses);
          devLog('step 4 → POST /expenses/bulk response', expenseResult);
        } else {
          devLog('step 4 → no expenses to persist (all amounts are 0)');
        }
        return { nextStep: null, onboardingStatus: 'pending' };
      }

      if (payload.step === 5) {
        // Review confirmed — signal step 4 completion to backend and generate artifacts.
        const step4 = useOnboardingStore.getState().step4;
        if (!step4) {
          throw new Error('Expense data not found — please go back and complete expenses.');
        }
        devLog('review → POST /onboarding/advance (step 4)');
        const result = await onboardingAdapter.advance({ step: 4, data: step4 });
        devLog('review → /onboarding/advance response', result);
        if (result.onboardingStatus === 'complete') {
          devLog('onboarding complete → generating artifacts');
          await generatePostOnboardingArtifacts({
            hasDebts: useOnboardingStore.getState().step3?.hasDebts ?? false,
          });
          devLog('onboarding complete → artifacts done');
        }
        return result;
      }

      // Steps 1–3: advance immediately.
      devLog(`step ${payload.step} → POST /onboarding/advance`);
      const result = await onboardingAdapter.advance(payload as AdvancePayload);
      devLog(`step ${payload.step} → /onboarding/advance response`, result);
      return result;
    },

    onSuccess: (result, payload) => {
      if (payload.step === 4) {
        // Expenses saved — advance locally to review step (no backend call needed).
        devLog('step 4 saved → advancing to review step');
        useOnboardingStore.getState().goNext();
      } else if (result.onboardingStatus === 'complete') {
        devLog('onboarding complete → navigating to dashboard');
        updateUser({ onboardingStatus: 'complete' });
        void queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
        reset();
        navigate(ROUTES.DASHBOARD, { replace: true });
      } else {
        devLog(`advance succeeded → moving to next step (current: ${useOnboardingStore.getState().currentStep})`);
        useOnboardingStore.getState().goNext();
      }
    },

    onError: (err, payload) => {
      devWarn(`step ${payload.step} failed`, err);
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

  const handleReviewComplete = () => {
    advanceMutation.mutate({ step: 5 });
  };

  return {
    currentStep,
    goBack,
    handleStep1Complete,
    handleStep2Complete,
    handleStep3Complete,
    handleStep4Complete,
    handleReviewComplete,
    isSubmitting: advanceMutation.isPending,
    submitError: advanceMutation.error instanceof Error ? advanceMutation.error : null,
    step1,
    step2,
    step3,
    step4: useOnboardingStore.getState().step4,
  };
}
