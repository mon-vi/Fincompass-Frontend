import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { ROUTES } from '@/constants/routes';
import { useOnboardingStore } from '../store/onboardingStore';
import { onboardingAdapter } from '../services';
import type { AdvancePayload } from '../services';
import type { Step1Data, Step2Data, Step3Data, Step4Data } from '../validation';

export function useOnboarding() {
  const navigate = useNavigate();
  const updateUser = useAuthStore((s) => s.updateUser);

  const { currentStep, goBack, step1, step2, step3, saveStep1, saveStep2, saveStep3, saveStep4, reset } =
    useOnboardingStore();

  // Each step submission calls POST /api/v1/onboarding/advance.
  // On success the hook advances the local step or redirects to dashboard.
  const advanceMutation = useMutation({
    mutationFn: (payload: AdvancePayload) => onboardingAdapter.advance(payload),
    onSuccess: (result) => {
      if (result.onboardingStatus === 'complete') {
        updateUser({ onboardingStatus: 'complete' });
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
