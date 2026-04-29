import { get, post } from '@/services/apiClient';
import { handleApiError } from '@/services/apiError';
import { apiPath, API } from '@/config/endpoints';
import type { LaravelResource } from '@/services/apiError';
import type {
  OnboardingApiAdapter,
  OnboardingStatusResponse,
  AdvancePayload,
  AdvanceResponse,
} from './onboardingApi';

/**
 * Real adapter assumptions:
 * - GET  /api/v1/onboarding → { current_step: 1, completed_steps: [] }
 * - POST /api/v1/onboarding/advance → { next_step: 2|null, onboarding_status: 'pending'|'complete' }
 *   Body: { step: 1, data: {...} }
 * Confirm field names with the Laravel team before enabling.
 */

interface LaravelProfile {
  onboarding_step: number;
  is_onboarding_complete: boolean;
}

interface LaravelOnboardingStatus {
  current_step: number;
  is_complete?: boolean;
  profile?: LaravelProfile;
}

function completedStepsFrom(currentStep: number, isComplete = false): OnboardingStatusResponse['completedSteps'] {
  if (isComplete) return [1, 2, 3, 4];
  return [1, 2, 3, 4].filter((step) => step < currentStep) as OnboardingStatusResponse['completedSteps'];
}

export const onboardingReal: OnboardingApiAdapter = {
  async getStatus(): Promise<OnboardingStatusResponse> {
    try {
      const res = await get<LaravelResource<LaravelOnboardingStatus>>(apiPath(API.ONBOARDING.STATUS));
      const raw = res.data;
      const currentStep = (raw.current_step ?? raw.profile?.onboarding_step ?? 1) as OnboardingStatusResponse['currentStep'];
      return {
        currentStep,
        completedSteps: completedStepsFrom(currentStep, raw.is_complete ?? raw.profile?.is_onboarding_complete),
      };
    } catch (err) {
      handleApiError(err);
    }
  },

  async advance(payload: AdvancePayload): Promise<AdvanceResponse> {
    try {
      const res = await post<LaravelResource<LaravelProfile>>(apiPath(API.ONBOARDING.ADVANCE), {
        step: payload.step,
        data: payload.data,
      });
      const profile = res.data;
      const isComplete = profile.is_onboarding_complete;
      return {
        nextStep: isComplete ? null : profile.onboarding_step as AdvanceResponse['nextStep'],
        onboardingStatus: isComplete ? 'complete' : 'pending',
      };
    } catch (err) {
      handleApiError(err);
    }
  },
};
