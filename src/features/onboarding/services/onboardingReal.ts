import { get, post } from '@/services/apiClient';
import { handleApiError } from '@/services/apiError';
import { apiPath, API } from '@/config/endpoints';
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

interface LaravelOnboardingStatus {
  current_step: number;
  completed_steps: number[];
}

interface LaravelAdvanceResponse {
  next_step: number | null;
  onboarding_status: 'pending' | 'complete';
}

export const onboardingReal: OnboardingApiAdapter = {
  async getStatus(): Promise<OnboardingStatusResponse> {
    try {
      const raw = await get<LaravelOnboardingStatus>(apiPath(API.ONBOARDING.STATUS));
      return {
        currentStep: raw.current_step as OnboardingStatusResponse['currentStep'],
        completedSteps: raw.completed_steps as OnboardingStatusResponse['completedSteps'],
      };
    } catch (err) {
      handleApiError(err);
    }
  },

  async advance(payload: AdvancePayload): Promise<AdvanceResponse> {
    try {
      const raw = await post<LaravelAdvanceResponse>(apiPath(API.ONBOARDING.ADVANCE), {
        step: payload.step,
        data: payload.data,
      });
      return {
        nextStep: raw.next_step as AdvanceResponse['nextStep'],
        onboardingStatus: raw.onboarding_status,
      };
    } catch (err) {
      handleApiError(err);
    }
  },
};
