import { get, post } from '@/services/apiClient';
import { handleApiError } from '@/services/apiError';
import { apiPath, API } from '@/config/endpoints';
import { ENV } from '@/constants/env';
import type { LaravelResource } from '@/services/apiError';
import type {
  OnboardingApiAdapter,
  OnboardingStepNumber,
  OnboardingStatusResponse,
  AdvancePayload,
  AdvanceResponse,
} from './onboardingApi';

/**
 * Real adapter assumptions:
 * - GET  /api/v1/onboarding → { current_step: 1, completed_steps: [] }
 * - POST /api/v1/onboarding/advance → profile object with onboarding_step / is_onboarding_complete
 *   Body: { step: 1, data: {...} }
 *
 * Response shape handled defensively — backend field names confirmed below.
 * If backend adds/renames fields, update the LaravelProfile interface and
 * the resolveIsComplete() helper.
 */

interface LaravelProfile {
  onboarding_step?: number;
  is_onboarding_complete?: boolean;
  /** alternate casing some Laravel versions use */
  onboarding_status?: 'pending' | 'complete';
  next_step?: number | null;
}

interface LaravelOnboardingStatus {
  current_step?: number;
  is_complete?: boolean;
  profile?: LaravelProfile;
}

type UnknownRecord = Record<string, unknown>;

function asRecord(v: unknown): UnknownRecord {
  return v && typeof v === 'object' ? (v as UnknownRecord) : {};
}

function resolveIsComplete(profile: LaravelProfile | UnknownRecord): boolean {
  if (typeof profile.is_onboarding_complete === 'boolean') return profile.is_onboarding_complete;
  if (profile.onboarding_status === 'complete') return true;
  // next_step: null is the backend's "you're done" signal
  if ('next_step' in profile && profile.next_step === null) return true;
  // onboarding_step > 4 means all steps are past the last step
  if (typeof profile.onboarding_step === 'number' && profile.onboarding_step > 4) return true;
  return false;
}

function resolveNextStep(profile: LaravelProfile | UnknownRecord, isComplete: boolean): OnboardingStepNumber | null {
  if (isComplete) return null;
  if (typeof profile.next_step === 'number') return profile.next_step as OnboardingStepNumber;
  if (typeof profile.onboarding_step === 'number') return profile.onboarding_step as OnboardingStepNumber;
  return null;
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
      const res = await post<LaravelResource<UnknownRecord> | UnknownRecord>(apiPath(API.ONBOARDING.ADVANCE), {
        step: payload.step,
        data: payload.data,
      });

      // Unwrap Laravel resource envelope if present
      const raw: UnknownRecord = Object.prototype.hasOwnProperty.call(res, 'data')
        ? asRecord((res as LaravelResource<UnknownRecord>).data)
        : asRecord(res);

      if (ENV.IS_DEV) {
        console.log('[Onboarding] /onboarding/advance raw response', raw);
      }

      const isComplete = resolveIsComplete(raw);
      const nextStep = resolveNextStep(raw, isComplete);

      return {
        nextStep,
        onboardingStatus: isComplete ? 'complete' : 'pending',
      };
    } catch (err) {
      handleApiError(err);
    }
  },
};
