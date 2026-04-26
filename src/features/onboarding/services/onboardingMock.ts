import type {
  AdvancePayload,
  AdvanceResponse,
  OnboardingApiAdapter,
  OnboardingStatusResponse,
} from './onboardingApi';

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const onboardingMock: OnboardingApiAdapter = {
  async getStatus(): Promise<OnboardingStatusResponse> {
    await delay(400);
    // Mock always starts fresh — the local Zustand store owns resume state
    return { currentStep: 1, completedSteps: [] };
  },

  async advance(payload: AdvancePayload): Promise<AdvanceResponse> {
    await delay(800);
    if (payload.step === 4) {
      return { nextStep: null, onboardingStatus: 'complete' };
    }
    return {
      nextStep: (payload.step + 1) as 2 | 3 | 4,
      onboardingStatus: 'pending',
    };
  },
};
