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

const TOTAL_STEPS = 4;

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

  if (user?.onboardingStatus === 'complete') {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* ── Top header ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-white/70 bg-white/90 px-4 py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#12355b] text-xs font-black text-white shadow-sm">
              FC
            </span>
            <span className="font-black tracking-tight text-slate-950">FinCompass</span>
          </div>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
            Welcome, {user?.firstName ?? 'there'}
          </span>
        </div>
      </header>

      {/* ── Step progress bar ───────────────────────────────────────────── */}
      <div className="bg-white/80 px-4 py-3">
        <div className="mx-auto max-w-2xl">
          {/* Step label */}
          <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-500">
            <span className="text-[#12355b]">{STEP_META[currentStep].title}</span>
            <span>Step {currentStep} of {TOTAL_STEPS}</span>
          </div>
          {/* Progress track */}
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-[#12355b] transition-all duration-300"
              style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
            />
          </div>
          {/* Step dots */}
          <div className="mt-3">
            <ProgressIndicator currentStep={currentStep} />
          </div>
        </div>
      </div>

      {/* ── Main content ────────────────────────────────────────────────── */}
      <main className="flex-1 px-4 py-6 pb-8">
        <div className="mx-auto w-full max-w-2xl space-y-4">
          {/* Context card – brief, not sticky on mobile */}
          <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm shadow-slate-900/[0.04] backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[#12355b] p-2 text-white">
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-slate-950">No perfect answers needed.</span>{' '}
                You can refine everything from your dashboard later.
              </p>
            </div>
          </div>

          {/* Step form */}
          <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/95 p-5 shadow-lg shadow-slate-900/[0.06] sm:p-8">
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

          {/* Auto-save notice */}
          <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
            Your answers are saved after each Continue.
          </div>
        </div>
      </main>
    </div>
  );
}
