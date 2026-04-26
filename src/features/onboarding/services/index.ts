import type { OnboardingApiAdapter } from './onboardingApi';
import { onboardingMock } from './onboardingMock';
import { ENV } from '@/constants/env';

// Real adapter: import { onboardingApi } from './onboardingReal' once the Laravel API is live.
export const onboardingAdapter: OnboardingApiAdapter = ENV.USE_MOCK_API
  ? onboardingMock
  : onboardingMock;

export type { OnboardingApiAdapter, OnboardingPayload } from './onboardingApi';
