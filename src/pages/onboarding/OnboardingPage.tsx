import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useOnboarding } from '@/features/onboarding/hooks/useOnboarding';
import { ProgressIndicator } from '@/features/onboarding/components/ProgressIndicator';
import { GoalSelectionStep } from '@/features/onboarding/steps/GoalSelectionStep';
import { IncomeSetupStep } from '@/features/onboarding/steps/IncomeSetupStep';
import { DebtSetupStep } from '@/features/onboarding/steps/DebtSetupStep';
import { ExpenseSetupStep } from '@/features/onboarding/steps/ExpenseSetupStep';
import { STEP_META } from '@/features/onboarding/store/onboardingStore';
import { ROUTES } from '@/constants/routes';

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

  // Must come after all hook calls (Rules of Hooks)
  if (user?.onboardingStatus === 'complete') {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_top,rgba(18,53,91,0.16),transparent_62%)]" />
      <header className="relative border-b border-white/70 bg-white/80 px-4 py-4 backdrop-blur-xl sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#12355b] text-sm font-black text-white shadow-sm shadow-slate-900/20">
              FC
            </span>
            <div>
              <span className="block text-lg font-black tracking-tight text-slate-950">FinCompass</span>
              <span className="hidden text-xs font-medium text-slate-500 sm:block">Setup should feel calm.</span>
            </div>
          </div>
          <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
            Welcome, {user?.firstName ?? 'there'}
          </span>
        </div>
      </header>

      <main className="relative flex flex-1 flex-col items-center px-4 py-8 sm:px-6 sm:py-12">
        <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-xl shadow-slate-900/[0.05] backdrop-blur lg:sticky lg:top-24">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#2b6d91]">Guided setup</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Build your first financial map.
            </h1>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Four quick checkpoints help FinCompass understand your income, debts, and monthly costs. No perfect answers needed.
            </p>
            <div className="mt-6 rounded-2xl bg-[#12355b] p-4 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-100">Current checkpoint</p>
              <p className="mt-2 text-xl font-black tracking-tight">{STEP_META[currentStep].title}</p>
              <p className="mt-1 text-sm text-sky-100">Step {currentStep} of 4. Saved as you continue.</p>
            </div>
            <p className="mt-4 text-xs leading-5 text-slate-500">
              You can refine everything later from your dashboard. This setup just gets your plan moving.
            </p>
          </div>

          <div className="space-y-5">
            <div className="rounded-[2rem] border border-white/70 bg-white/85 p-4 shadow-sm shadow-slate-900/[0.04] backdrop-blur sm:p-5">
              <ProgressIndicator currentStep={currentStep} />
            </div>

            <div className="rounded-[2rem] border border-slate-200/80 bg-white/95 p-5 shadow-xl shadow-slate-900/[0.06] sm:p-8">
              {currentStep === 1 && (
                <GoalSelectionStep
                  onComplete={handleStep1Complete}
                  defaultValues={step1}
                  isSubmitting={isSubmitting}
                  submitError={submitError}
                />
              )}
              {currentStep === 2 && (
                <IncomeSetupStep
                  onComplete={handleStep2Complete}
                  onBack={goBack}
                  defaultValues={step2}
                  isSubmitting={isSubmitting}
                  submitError={submitError}
                />
              )}
              {currentStep === 3 && (
                <DebtSetupStep
                  onComplete={handleStep3Complete}
                  onBack={goBack}
                  defaultValues={step3}
                  isSubmitting={isSubmitting}
                  submitError={submitError}
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

            <div className="flex items-center justify-center gap-2 rounded-2xl bg-white/75 px-4 py-3 text-center text-xs font-medium text-slate-500 ring-1 ring-slate-200/70">
              <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
              Your answers are saved after each Continue.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
