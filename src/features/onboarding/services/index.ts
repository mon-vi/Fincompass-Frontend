import type { OnboardingApiAdapter } from './onboardingApi';
import { onboardingMock } from './onboardingMock';
import { ENV } from '@/constants/env';

// Real adapter: import { onboardingReal } from './onboardingReal' once the Laravel API is live.
// onboardingReal must implement GET /api/v1/onboarding (getStatus) and
// POST /api/v1/onboarding/advance (advance). See docs/api-integration.md.
export const onboardingAdapter: OnboardingApiAdapter = ENV.USE_MOCK_API
  ? onboardingMock
  : onboardingMock;

export type {
  OnboardingApiAdapter,
  AdvancePayload,
  AdvanceResponse,
  OnboardingStatusResponse,
  OnboardingStepNumber,
} from './onboardingApi';
