import type { OnboardingApiAdapter, OnboardingPayload } from './onboardingApi';

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const onboardingMock: OnboardingApiAdapter = {
  async submit(_payload: OnboardingPayload): Promise<void> {
    await delay(1200);
    // Real API: POST /api/v1/onboarding — returns updated user with onboardingStatus: 'complete'
  },
};
