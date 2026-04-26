# Onboarding Flow — Structure & Resume Behaviour

## Overview

New users are sent to `/onboarding` after registration (or login if `onboardingStatus === 'pending'`). The flow has 4 sequential steps. Progress is saved to `localStorage` after each step so users can close the browser and resume exactly where they left off.

## Steps

| # | Route segment | Component | Data collected |
|---|---|---|---|
| 1 | Goals | `GoalSelectionStep` | `goals: GoalType[]` (multi-select) |
| 2 | Income | `IncomeSetupStep` | `monthlyIncome: number`, `incomeType` |
| 3 | Debts | `DebtSetupStep` | `hasDebts`, `totalDebtBalance?`, `averageInterestRate?`, `primaryDebtType?` |
| 4 | Expenses | `ExpenseSetupStep` | `housing`, `transportation`, `food`, `utilities`, `other` |

## Navigation

- **Forward**: each step's form has a "Continue →" submit button. Zod validates the current step's schema on submit. If invalid, errors are shown inline; the user stays on the current step.
- **Backward**: "← Back" button navigates to the previous step. No validation on back — the current step's partially entered data is preserved in RHF's form state until the component unmounts.
- **Resume**: step data from steps 1–3 is persisted to `localStorage` (`fincompass:onboarding`) via Zustand. On returning to `/onboarding`, the last active step and all previously saved step data are restored as form `defaultValues`.

## State Architecture

```
useOnboardingStore (Zustand + persist)
├── currentStep: 1 | 2 | 3 | 4
├── step1?: Step1Data
├── step2?: Step2Data
├── step3?: Step3Data
└── step4?: Step4Data
```

Each step saves data to the store **only when the user successfully submits that step** (i.e., passes validation). The store is reset after successful final submission.

## Submission (Step 4)

On step 4 submit:
1. `ExpenseSetupStep` validates and calls `handleStep4Complete(data)`.
2. `useOnboarding` hook assembles the full payload `{ step1, step2, step3, step4 }`.
3. `onboardingAdapter.submit(payload)` is called (TanStack Query mutation).
4. On success: `updateUser({ onboardingStatus: 'complete' })` → `reset()` onboarding store → navigate to `/dashboard`.
5. On error: the error is surfaced in `ExpenseSetupStep` via the `submitError` prop.

## Validation Schemas

All schemas live in `src/features/onboarding/validation/index.ts`.

| Step | Key rules |
|---|---|
| Step 1 | At least one goal must be selected |
| Step 2 | `monthlyIncome > 0`; `incomeType` required |
| Step 3 | If `hasDebts === true`: `totalDebtBalance > 0` and `primaryDebtType` required |
| Step 4 | All fields `≥ 0`; all default to 0 |

## Goal Options

| Value | Label |
|---|---|
| `pay_off_debt` | Pay off debt |
| `emergency_fund` | Build emergency fund |
| `save_for_purchase` | Save for a purchase |
| `grow_wealth` | Grow wealth |
| `improve_cash_flow` | Improve cash flow |

## Laravel API Contract

The backend exposes two endpoints:

| Method | Path | When called |
|---|---|---|
| `GET` | `/api/v1/onboarding` | Fetch server-side progress (Phase 3 — not yet wired into the UI) |
| `POST` | `/api/v1/onboarding/advance` | Called after each step's validation passes |

Each step completion calls `POST /api/v1/onboarding/advance`. The frontend currently assumes the request body shape is:

```json
{ "step": 1, "data": { "goals": ["pay_off_debt"] } }
{ "step": 2, "data": { "monthlyIncome": 4000, "incomeType": "salary" } }
{ "step": 3, "data": { "hasDebts": true, "totalDebtBalance": 15000, ... } }
{ "step": 4, "data": { "housing": 1200, "transportation": 400, ... } }
```

Expected response for steps 1–3:

```json
{ "nextStep": 2, "onboardingStatus": "pending" }
```

Expected response for step 4 (completion):

```json
{ "nextStep": null, "onboardingStatus": "complete" }
```

On completion, the frontend updates local Zustand user state (`onboardingStatus: 'complete'`) and navigates to `/dashboard`.

**Open questions to confirm with backend:**
- Does the endpoint accept `{ step, data }` or the step data directly (server derives step from session)?
- Exact shape of `GET /api/v1/onboarding` response.
- Whether `nextStep: null` or a dedicated `complete: true` field signals completion.

See `docs/api-integration.md` for the full breakdown and `onboardingReal.ts` template.

## UX Notes

- The `ProgressIndicator` shows step numbers 1–4 with a check mark on completed steps and a connecting line that fills as the user advances.
- Step labels (`Goals`, `Income`, `Debts`, `Expenses`) appear below the circles on `sm:` screens and above.
- The current step title appears below the progress bar (`Step X of 4 — {title}`).
- A note at the bottom of the onboarding card reminds users their progress is saved automatically.
- The onboarding page has its own minimal layout (no sidebar, no main nav) — just the FinCompass wordmark and a welcome message.
