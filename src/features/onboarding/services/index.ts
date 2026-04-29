import type { OnboardingApiAdapter } from './onboardingApi';
import { onboardingReal } from './onboardingReal';

export const onboardingAdapter: OnboardingApiAdapter = onboardingReal;

export type {
  OnboardingApiAdapter,
  AdvancePayload,
  AdvanceResponse,
  OnboardingStatusResponse,
  OnboardingStepNumber,
} from './onboardingApi';
