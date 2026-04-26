import type { Step1Data, Step2Data, Step3Data, Step4Data } from '../validation';

export interface OnboardingPayload {
  step1: Step1Data;
  step2: Step2Data;
  step3: Step3Data;
  step4: Step4Data;
}

export interface OnboardingApiAdapter {
  submit(payload: OnboardingPayload): Promise<void>;
}
