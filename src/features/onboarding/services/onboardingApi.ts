import type { Step1Data, Step2Data, Step3Data, Step4Data } from '../validation';

export type OnboardingStepNumber = 1 | 2 | 3 | 4;

/**
 * Discriminated union sent to POST /api/v1/onboarding/advance.
 * The `step` discriminant lets the real adapter serialise the payload correctly
 * and gives TypeScript exhaustive checks per step.
 *
 * OPEN QUESTION (backend): does the endpoint accept `{ step, data }` as shown
 * here, or does it accept the step data directly and derive the step from
 * server-side session state? Confirm with the Laravel team before writing
 * onboardingReal.ts.
 */
export type AdvancePayload =
  | { step: 1; data: Step1Data }
  | { step: 2; data: Step2Data }
  | { step: 3; data: Step3Data }
  | { step: 4; data: Step4Data };

/**
 * Response from GET /api/v1/onboarding.
 *
 * OPEN QUESTION (backend): exact field names and shape are assumed — confirm
 * before writing onboardingReal.ts.
 */
export interface OnboardingStatusResponse {
  currentStep: OnboardingStepNumber;
  completedSteps: OnboardingStepNumber[];
}

/**
 * Response from POST /api/v1/onboarding/advance.
 * `nextStep` is null when the final step has been advanced (onboarding complete).
 *
 * OPEN QUESTION (backend): confirm field names and whether `onboardingStatus`
 * is returned here or only on the user object.
 */
export interface AdvanceResponse {
  nextStep: OnboardingStepNumber | null;
  onboardingStatus: 'pending' | 'complete';
}

export interface OnboardingApiAdapter {
  /** GET /api/v1/onboarding — fetch current server-side onboarding progress */
  getStatus(): Promise<OnboardingStatusResponse>;
  /** POST /api/v1/onboarding/advance — submit one step's data and advance */
  advance(payload: AdvancePayload): Promise<AdvanceResponse>;
}
