import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { ROUTES } from '@/constants/routes';
import { useOnboardingStore } from '../store/onboardingStore';
import { onboardingAdapter } from '../services';
import type { Step1Data, Step2Data, Step3Data, Step4Data } from '../validation';

export function useOnboarding() {
  const navigate = useNavigate();
  const updateUser = useAuthStore((s) => s.updateUser);

  const { currentStep, goBack, step1, step2, step3, saveStep1, saveStep2, saveStep3, saveStep4, reset } =
    useOnboardingStore();

  const submitMutation = useMutation({
    mutationFn: (payload: { step1: Step1Data; step2: Step2Data; step3: Step3Data; step4: Step4Data }) =>
      onboardingAdapter.submit(payload),
    onSuccess: () => {
      updateUser({ onboardingStatus: 'complete' });
      reset();
      navigate(ROUTES.DASHBOARD, { replace: true });
    },
  });

  const handleStep1Complete = (data: Step1Data) => {
    saveStep1(data);
    useOnboardingStore.getState().goNext();
  };

  const handleStep2Complete = (data: Step2Data) => {
    saveStep2(data);
    useOnboardingStore.getState().goNext();
  };

  const handleStep3Complete = (data: Step3Data) => {
    saveStep3(data);
    useOnboardingStore.getState().goNext();
  };

  const handleStep4Complete = (data: Step4Data) => {
    saveStep4(data);
    if (!step1 || !step2 || !step3) return;
    submitMutation.mutate({ step1, step2, step3, step4: data });
  };

  return {
    currentStep,
    goBack,
    handleStep1Complete,
    handleStep2Complete,
    handleStep3Complete,
    handleStep4Complete,
    isSubmitting: submitMutation.isPending,
    submitError: submitMutation.error instanceof Error ? submitMutation.error : null,
    step1,
    step2,
    step3,
    step4: useOnboardingStore.getState().step4,
  };
}
