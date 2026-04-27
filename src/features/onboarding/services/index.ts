import type { OnboardingApiAdapter } from './onboardingApi';
import { onboardingMock } from './onboardingMock';
import { onboardingReal } from './onboardingReal';
import { ENV } from '@/constants/env';

export const onboardingAdapter: OnboardingApiAdapter = ENV.USE_MOCK_API ? onboardingMock : onboardingReal;

export type {
  OnboardingApiAdapter,
  AdvancePayload,
  AdvanceResponse,
  OnboardingStatusResponse,
  OnboardingStepNumber,
} from './onboardingApi';
