import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Step1Data, Step2Data, Step3Data, Step4Data } from '../validation';

export type OnboardingStep = 1 | 2 | 3 | 4 | 5;
export const TOTAL_STEPS = 5;

export const STEP_META: Record<
  OnboardingStep,
  { label: string; title: string; subtitle: string; loadingLabel: string }
> = {
  1: {
    label: 'Goals',
    title: 'What do you want FinCompass to help you improve first?',
    subtitle: "Select every goal that fits — we'll shape your first dashboard around them.",
    loadingLabel: 'Saving your goals…',
  },
  2: {
    label: 'Income',
    title: 'How much do you bring home each month?',
    subtitle: 'Use your average take-home pay after tax. A close estimate is enough.',
    loadingLabel: 'Saving your income…',
  },
  3: {
    label: 'Debts',
    title: 'Do you have any debts right now?',
    subtitle: "Include credit cards, loans, or other balances. Debt-free? Skip right through.",
    loadingLabel: 'Saving your debt info…',
  },
  4: {
    label: 'Expenses',
    title: 'What are your regular monthly expenses?',
    subtitle: "Round numbers are fine — you can refine everything from your dashboard later.",
    loadingLabel: 'Saving your expenses…',
  },
  5: {
    label: 'Review',
    title: "Here's your financial snapshot.",
    subtitle: 'Review the numbers, then let FinCompass build your first monthly plan.',
    loadingLabel: 'Building your first plan…',
  },
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
