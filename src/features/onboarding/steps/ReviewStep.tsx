import { cn } from '@/utils/cn';
import { Alert } from '@/components/ui/Alert';
import { EXPENSE_FIELDS, type Step2Data, type Step3Data, type Step4Data } from '../validation';
import type { OnboardingStep } from '../store/onboardingStore';

interface ReviewStepProps {
  step2?: Step2Data;
  step3?: Step3Data;
  step4?: Step4Data;
  submitError?: Error | null;
  onEditStep: (step: OnboardingStep) => void;
}

function fmt(n: number | undefined | null): string {
  if (n == null) return '—';
  return `$${n.toLocaleString()}`;
}

function EditButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="shrink-0 rounded-lg px-2 py-1 text-xs font-semibold text-[#2b6d91] transition-colors hover:bg-slate-100"
    >
      Edit
    </button>
  );
}

export function ReviewStep({ step2, step3, step4, submitError, onEditStep }: ReviewStepProps) {
  const income = step2?.monthlyIncome ?? 0;

  const totalExpenses = step4
    ? EXPENSE_FIELDS.reduce((sum, { name }) => sum + (step4[name] ?? 0), 0)
    : 0;

  const remaining = income - totalExpenses;

  return (
    <div className="space-y-3">
      {/* Income */}
      <div className="rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm shadow-slate-900/[0.03]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-xl" aria-hidden="true">
              💰
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Monthly income</p>
              <p className="text-2xl font-black text-slate-950">{fmt(income)}</p>
              {step2?.incomeType && (
                <p className="text-xs capitalize text-slate-400">
                  {step2.incomeType.replace(/_/g, ' ')}
                </p>
              )}
            </div>
          </div>
          <EditButton onClick={() => onEditStep(2)} />
        </div>
      </div>

      {/* Debts */}
      {step3?.hasDebts ? (
        <div className="rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm shadow-slate-900/[0.03]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-xl" aria-hidden="true">
                💳
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total debt balance</p>
                <p className="text-2xl font-black text-slate-950">{fmt(step3.totalDebtBalance)}</p>
                {step3.primaryDebtType && (
                  <p className="text-xs capitalize text-slate-400">
                    {step3.primaryDebtType.replace(/_/g, ' ')}
                  </p>
                )}
              </div>
            </div>
            <EditButton onClick={() => onEditStep(3)} />
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm shadow-emerald-900/[0.03]">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-xl" aria-hidden="true">
              ✅
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Debts</p>
              <p className="text-lg font-bold text-emerald-800">Debt-free</p>
            </div>
            <EditButton onClick={() => onEditStep(3)} />
          </div>
        </div>
      )}

      {/* Expenses */}
      <div className="rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm shadow-slate-900/[0.03]">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2b6d91]/10 text-xl" aria-hidden="true">
              📊
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Monthly expenses</p>
              <p className="text-2xl font-black text-slate-950">{fmt(totalExpenses)}</p>
            </div>
          </div>
          <EditButton onClick={() => onEditStep(4)} />
        </div>

        {step4 && (
          <div className="grid grid-cols-2 gap-1.5 border-t border-slate-100 pt-3">
            {EXPENSE_FIELDS.filter(({ name }) => (step4[name] ?? 0) > 0).map(({ name, label }) => (
              <div key={name} className="flex justify-between gap-2 text-xs text-slate-600">
                <span className="truncate">{label}</span>
                <span className="shrink-0 font-semibold">{fmt(step4[name])}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Remaining cash */}
      <div
        className={cn(
          'rounded-2xl border p-4',
          remaining >= 0 ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50',
        )}
      >
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl" aria-hidden="true">
            {remaining >= 0 ? '📈' : '⚠️'}
          </span>
          <div>
            <p
              className={cn(
                'text-xs font-semibold uppercase tracking-wide',
                remaining >= 0 ? 'text-emerald-700' : 'text-amber-700',
              )}
            >
              Estimated remaining each month
            </p>
            <p
              className={cn(
                'text-2xl font-black',
                remaining >= 0 ? 'text-emerald-800' : 'text-amber-800',
              )}
            >
              {remaining >= 0 ? fmt(remaining) : `-$${Math.abs(remaining).toLocaleString()}`}
            </p>
            <p className={cn('mt-0.5 text-xs', remaining >= 0 ? 'text-emerald-600' : 'text-amber-700')}>
              {remaining >= 0
                ? 'after expenses, before any debt payments'
                : "expenses exceed income — we'll help you find breathing room"}
            </p>
          </div>
        </div>
      </div>

      {/* What happens next */}
      <div className="rounded-2xl border border-[#12355b]/10 bg-[#12355b]/5 p-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[#2b6d91]">What happens next</p>
        <ul className="space-y-1.5 text-sm text-slate-700">
          {[
            'Your first budget will be calculated',
            'A financial health score will be generated',
            'Personalised guidance will be prepared',
            'An action plan will be ready on your dashboard',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-0.5 shrink-0 text-[#12355b]">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {submitError && (
        <Alert variant="error">
          {submitError.message ?? 'Setup did not finish. Check your connection and try again.'}
        </Alert>
      )}
    </div>
  );
}
