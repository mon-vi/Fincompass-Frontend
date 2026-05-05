import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useOnboarding } from '@/features/onboarding/hooks/useOnboarding';
import { ProgressIndicator } from '@/features/onboarding/components/ProgressIndicator';
import { GoalSelectionStep } from '@/features/onboarding/steps/GoalSelectionStep';
import { IncomeSetupStep } from '@/features/onboarding/steps/IncomeSetupStep';
import { DebtSetupStep } from '@/features/onboarding/steps/DebtSetupStep';
import { ExpenseSetupStep } from '@/features/onboarding/steps/ExpenseSetupStep';
import { ReviewStep } from '@/features/onboarding/steps/ReviewStep';
import { useOnboardingStore, STEP_META, TOTAL_STEPS } from '@/features/onboarding/store/onboardingStore';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';

// Shared form id — links the external submit button to whichever step form is active.
const FORM_ID = 'onboarding-step-form';

export function OnboardingPage() {
  const user = useAuthStore((s) => s.user);

  const {
    currentStep,
    goBack,
    handleStep1Complete,
    handleStep2Complete,
    handleStep3Complete,
    handleStep4Complete,
    handleReviewComplete,
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

  const isReviewStep = currentStep === 5;
  const isFirstStep = currentStep === 1;
  const stepMeta = STEP_META[currentStep];

  return (
    <div className="flex min-h-screen flex-col bg-transparent">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 px-4 py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#12355b] text-xs font-black text-white">
              FC
            </span>
            <span className="font-black tracking-tight text-slate-950">FinCompass</span>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Step {currentStep} of {TOTAL_STEPS}
          </span>
        </div>
      </header>

      {/* ── Progress ────────────────────────────────────────────────────────── */}
      <div className="border-b border-slate-200/80 bg-white/90 px-4 pb-3 pt-4 backdrop-blur-xl">
        <div className="mx-auto max-w-xl">
          <div className="mb-4 h-1 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-[#12355b] transition-all duration-500"
              style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
            />
          </div>
          <ProgressIndicator currentStep={currentStep} />
        </div>
      </div>

      {/* ── Scrollable content ──────────────────────────────────────────────── */}
      <main className="flex-1">
        <div className="mx-auto max-w-xl px-4 py-6" style={{ paddingBottom: 'calc(8.5rem + env(safe-area-inset-bottom, 0px))' }}>
          {/* Step heading */}
          <div className="mb-6">
            <h1 className="text-2xl font-black leading-snug tracking-tight text-slate-950">
              {stepMeta.title}
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">{stepMeta.subtitle}</p>
          </div>

          {/* Step content */}
          {currentStep === 1 && (
            <GoalSelectionStep
              formId={FORM_ID}
              onComplete={handleStep1Complete}
              defaultValues={step1}
              isSubmitting={isSubmitting}
              submitError={submitError}
            />
          )}
          {currentStep === 2 && (
            <IncomeSetupStep
              formId={FORM_ID}
              onComplete={handleStep2Complete}
              defaultValues={step2}
              isSubmitting={isSubmitting}
              submitError={submitError}
            />
          )}
          {currentStep === 3 && (
            <DebtSetupStep
              formId={FORM_ID}
              onComplete={handleStep3Complete}
              defaultValues={step3}
              isSubmitting={isSubmitting}
              submitError={submitError}
            />
          )}
          {currentStep === 4 && (
            <ExpenseSetupStep
              formId={FORM_ID}
              onComplete={handleStep4Complete}
              defaultValues={step4}
              isSubmitting={isSubmitting}
              submitError={submitError}
            />
          )}
          {currentStep === 5 && (
            <ReviewStep
              step2={step2}
              step3={step3}
              step4={step4}
              submitError={submitError}
              onEditStep={(step) => useOnboardingStore.getState().setStep(step)}
            />
          )}
        </div>
      </main>

      {/* ── Sticky footer ───────────────────────────────────────────────────── */}
      <footer
        className="fixed bottom-0 left-0 right-0 z-20 border-t border-slate-200/80 bg-white/95 px-4 py-3 shadow-[0_-10px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl"
        style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom, 12px))' }}
      >
        <div className="mx-auto flex max-w-xl items-center gap-3">
          {!isFirstStep && (
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={goBack}
              disabled={isSubmitting}
              className="shrink-0"
            >
              ← Back
            </Button>
          )}

          {isReviewStep ? (
            <Button
              type="button"
              variant="accent"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
              onClick={handleReviewComplete}
              disabled={isSubmitting}
            >
              {isSubmitting ? stepMeta.loadingLabel : 'Finish setup'}
            </Button>
          ) : (
            <Button
              type="submit"
              form={FORM_ID}
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? stepMeta.loadingLabel : 'Save and continue'}
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}
