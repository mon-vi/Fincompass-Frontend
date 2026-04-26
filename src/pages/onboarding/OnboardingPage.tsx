import { useAuthStore } from '@/stores/authStore';
import { useOnboarding } from '@/features/onboarding/hooks/useOnboarding';
import { ProgressIndicator } from '@/features/onboarding/components/ProgressIndicator';
import { GoalSelectionStep } from '@/features/onboarding/steps/GoalSelectionStep';
import { IncomeSetupStep } from '@/features/onboarding/steps/IncomeSetupStep';
import { DebtSetupStep } from '@/features/onboarding/steps/DebtSetupStep';
import { ExpenseSetupStep } from '@/features/onboarding/steps/ExpenseSetupStep';
import { STEP_META } from '@/features/onboarding/store/onboardingStore';

export function OnboardingPage() {
  const user = useAuthStore((s) => s.user);

  const {
    currentStep,
    goBack,
    handleStep1Complete,
    handleStep2Complete,
    handleStep3Complete,
    handleStep4Complete,
    isSubmitting,
    submitError,
    step1,
    step2,
    step3,
    step4,
  } = useOnboarding();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <span className="text-xl font-bold text-indigo-600">FinCompass</span>
          <span className="text-sm text-slate-500">
            Welcome, {user?.firstName ?? 'there'} 👋
          </span>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-lg space-y-8">
          <div className="space-y-2">
            <ProgressIndicator currentStep={currentStep} />
            <p className="text-center text-xs text-slate-400">
              Step {currentStep} of 4 — {STEP_META[currentStep].title}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            {currentStep === 1 && (
              <GoalSelectionStep
                onComplete={handleStep1Complete}
                defaultValues={step1}
              />
            )}
            {currentStep === 2 && (
              <IncomeSetupStep
                onComplete={handleStep2Complete}
                onBack={goBack}
                defaultValues={step2}
              />
            )}
            {currentStep === 3 && (
              <DebtSetupStep
                onComplete={handleStep3Complete}
                onBack={goBack}
                defaultValues={step3}
              />
            )}
            {currentStep === 4 && (
              <ExpenseSetupStep
                onComplete={handleStep4Complete}
                onBack={goBack}
                defaultValues={step4}
                isSubmitting={isSubmitting}
                submitError={submitError}
              />
            )}
          </div>

          <p className="text-center text-xs text-slate-400">
            Your progress is saved automatically — you can come back and finish later.
          </p>
        </div>
      </main>
    </div>
  );
}
