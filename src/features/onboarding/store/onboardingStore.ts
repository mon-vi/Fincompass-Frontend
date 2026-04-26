import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Step1Data, Step2Data, Step3Data, Step4Data } from '../validation';

export type OnboardingStep = 1 | 2 | 3 | 4;
export const TOTAL_STEPS = 4;

export const STEP_META: Record<OnboardingStep, { label: string; title: string }> = {
  1: { label: 'Goals', title: 'Financial goals' },
  2: { label: 'Income', title: 'Income setup' },
  3: { label: 'Debts', title: 'Debt overview' },
  4: { label: 'Expenses', title: 'Monthly expenses' },
};

interface OnboardingStore {
  currentStep: OnboardingStep;
  step1?: Step1Data;
  step2?: Step2Data;
  step3?: Step3Data;
  step4?: Step4Data;

  setStep: (step: OnboardingStep) => void;
  goNext: () => void;
  goBack: () => void;
  saveStep1: (data: Step1Data) => void;
  saveStep2: (data: Step2Data) => void;
  saveStep3: (data: Step3Data) => void;
  saveStep4: (data: Step4Data) => void;
  reset: () => void;
}

const initialState = {
  currentStep: 1 as OnboardingStep,
  step1: undefined,
  step2: undefined,
  step3: undefined,
  step4: undefined,
};

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setStep: (step) => set({ currentStep: step }),

      goNext: () => {
        const next = Math.min(get().currentStep + 1, TOTAL_STEPS) as OnboardingStep;
        set({ currentStep: next });
      },

      goBack: () => {
        const prev = Math.max(get().currentStep - 1, 1) as OnboardingStep;
        set({ currentStep: prev });
      },

      saveStep1: (data) => set({ step1: data }),
      saveStep2: (data) => set({ step2: data }),
      saveStep3: (data) => set({ step3: data }),
      saveStep4: (data) => set({ step4: data }),

      reset: () => set(initialState),
    }),
    { name: 'fincompass:onboarding' },
  ),
);
