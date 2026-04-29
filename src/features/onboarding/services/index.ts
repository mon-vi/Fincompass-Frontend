import type { OnboardingApiAdapter } from './onboardingApi';
import { onboardingReal } from './onboardingReal';
export { generatePostOnboardingArtifacts } from './onboardingArtifacts';

export const onboardingAdapter: OnboardingApiAdapter = onboardingReal;

export type {
  OnboardingApiAdapter,
  AdvancePayload,
  AdvanceResponse,
  OnboardingStatusResponse,
  OnboardingStepNumber,
} from './onboardingApi';
