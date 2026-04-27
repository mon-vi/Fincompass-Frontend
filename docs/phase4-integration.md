# Phase 4 — Backend Integration Guide

This document covers everything a Laravel developer needs to wire the real backend to this frontend.

---

## 1. Environment setup

Copy `.env.example` and set:

```env
VITE_API_BASE_URL=https://api.yourapp.com
VITE_USE_MOCK_API=false
```

`VITE_USE_MOCK_API=true` uses the mock adapters (no network calls). Flip to `false` to hit the real API. The switch is in `src/constants/env.ts`.

---

## 2. API base URL & auth token

`src/services/apiClient.ts` creates an Axios instance at `VITE_API_BASE_URL`. Every outgoing request automatically attaches the Bearer token from Zustand's `authStore`:

```
Authorization: Bearer <token>
```

On 401 responses the client silently attempts `POST /api/v1/auth/refresh` (using the stored refresh token), retries the original request, and redirects to `/login` if refresh fails.

---

## 3. Response envelope conventions

All real adapters expect these Laravel envelope shapes:

| Envelope | Shape | Used for |
|---|---|---|
| `LaravelResource<T>` | `{ data: T, message?: string }` | Single objects |
| `LaravelCollection<T>` | `{ data: T[], links?: {...}, meta?: {...} }` | Lists |
| `LaravelMessage` | `{ message: string }` | Mutations with no return data |

Types are in `src/services/apiError.ts`.

---

## 4. Auth endpoints

| Method | Path | Request | Response |
|---|---|---|---|
| POST | `/api/v1/auth/login` | `{ email, password }` | `LaravelResource<{ user, token, refresh_token }>` |
| POST | `/api/v1/auth/register` | `{ first_name, last_name, email, password, password_confirmation }` | Same as login |
| POST | `/api/v1/auth/logout` | — | `LaravelMessage` |
| POST | `/api/v1/auth/refresh` | `{ refresh_token }` | `{ token, refresh_token }` |
| GET | `/api/v1/auth/me` | — | `LaravelResource<User>` |
| POST | `/api/v1/auth/forgot-password` | `{ email }` | `LaravelMessage` |
| POST | `/api/v1/auth/reset-password` | `{ token, email, password, password_confirmation }` | `LaravelMessage` |

**User object fields** (snake_case from Laravel, mapped to camelCase in frontend):

```json
{
  "id": "uuid",
  "first_name": "Jane",
  "last_name": "Doe",
  "email": "jane@example.com",
  "tier": "navigator",
  "onboarding_completed": true,
  "created_at": "ISO8601"
}
```

`tier` must be one of: `compass` | `navigator` | `cfo`.

---

## 5. Onboarding endpoints

| Method | Path | Request | Response |
|---|---|---|---|
| GET | `/api/v1/onboarding` | — | `LaravelResource<OnboardingStatus>` |
| POST | `/api/v1/onboarding/step` | `{ step: number, data: object }` | `LaravelResource<OnboardingStatus>` |
| POST | `/api/v1/onboarding/complete` | — | `LaravelMessage` |

**OnboardingStatus**:
```json
{ "current_step": 2, "completed_steps": [1] }
```

---

## 6. Dashboard

| Method | Path | Response |
|---|---|---|
| GET | `/api/v1/dashboard` | `LaravelResource<DashboardSummary>` |

Frontend type: `src/features/dashboard/services/dashboardApi.ts`. The backend should return `total_debt`, `monthly_payment`, `monthly_income`, `net_monthly`, `health_score`, `savings_rate`, `debt_free_date`.

---

## 7. Debts

| Method | Path | Notes |
|---|---|---|
| GET | `/api/v1/debts` | `LaravelCollection<Debt>` |
| GET | `/api/v1/debts/{id}` | `LaravelResource<Debt>` |
| POST | `/api/v1/debts` | Create |
| PATCH | `/api/v1/debts/{id}` | Update |
| DELETE | `/api/v1/debts/{id}` | Returns 204 |

Debt object: `name`, `balance`, `interest_rate`, `minimum_payment`, `debt_type`, `due_date?`.

---

## 8. Budget

| Method | Path | Notes |
|---|---|---|
| GET | `/api/v1/budget` | `LaravelResource<Budget>` |
| POST | `/api/v1/budget` | `UpdateBudgetPayload` → `LaravelResource<Budget>` |

Budget contains `month` (YYYY-MM), `total_budgeted`, `total_spent`, and a `categories` array.

---

## 9. Expenses

| Method | Path | Notes |
|---|---|---|
| GET | `/api/v1/expenses?month=YYYY-MM` | `LaravelCollection<Expense>` |
| POST | `/api/v1/expenses` | Create |
| PATCH | `/api/v1/expenses/{id}` | Update |
| DELETE | `/api/v1/expenses/{id}` | 204 |
| POST | `/api/v1/expenses/bulk` | `{ expenses: CreateExpensePayload[] }` → `LaravelCollection<Expense>` |

`category` must be one of: `housing` | `transportation` | `food` | `utilities` | `entertainment` | `healthcare` | `personal` | `education` | `other`.

`source` is managed server-side: `manual` | `ocr` | `email_parser`.

---

## 10. OCR

| Method | Path | Notes |
|---|---|---|
| POST | `/api/v1/ocr/upload` | `multipart/form-data` with `file` field → `{ session_id: string }` |
| GET | `/api/v1/ocr/sessions/{id}` | Poll until status = `ready` or `failed` |
| POST | `/api/v1/ocr/sessions/{id}/confirm` | `{ selected_ids: string[] }` → `{ imported: number }` |

**OcrSession** shape:
```json
{
  "id": "uuid",
  "status": "processing",
  "file_name": "statement.pdf",
  "file_size": 204800,
  "uploaded_at": "ISO8601",
  "processed_at": null,
  "error_message": null,
  "extracted_expenses": []
}
```

`status` lifecycle: `uploading` → `processing` → `ready` | `failed`.

The frontend polls every 1.5 seconds while status is `uploading` or `processing`.

---

## 11. Health Score

| Method | Path | Response |
|---|---|---|
| GET | `/api/v1/health-score` | `LaravelResource<HealthScore>` |

---

## 12. Timeline

| Method | Path | Query params |
|---|---|---|
| GET | `/api/v1/timeline` | `strategy=avalanche|snowball`, `extra_payment=number` |

---

## 13. Action Plan

| Method | Path | Notes |
|---|---|---|
| GET | `/api/v1/action-plan` | `LaravelCollection<ActionItem>` |
| PATCH | `/api/v1/action-plan/{id}` | `{ completed: boolean }` → `LaravelResource<ActionItem>` |

---

## 14. Guidance

| Method | Path | Notes |
|---|---|---|
| GET | `/api/v1/guidance` | `LaravelCollection<GuidanceTip>` |
| PATCH | `/api/v1/guidance/{id}/dismiss` | `LaravelResource<GuidanceTip>` |

---

## 15. Notifications

| Method | Path | Notes |
|---|---|---|
| GET | `/api/v1/notifications` | `LaravelCollection<Notification>` |
| PATCH | `/api/v1/notifications/{id}/read` | `LaravelResource<Notification>` |
| POST | `/api/v1/notifications/mark-all-read` | `LaravelMessage` |

---

## 16. ARIA (CFO tier only)

| Method | Path | Notes |
|---|---|---|
| GET | `/api/v1/aria/messages` | `LaravelCollection<AriaMessage>` |
| POST | `/api/v1/aria/messages` | `{ content: string }` → `LaravelResource<{ message, usage }>` |
| GET | `/api/v1/aria/usage` | `LaravelResource<AriaUsage>` |

**AriaUsage**: `{ used, limit, resets_at }`. The backend enforces the monthly message limit; the frontend reads `used >= limit` to disable the input.

Enforce via middleware: return `403` with `{ message: "ARIA is a CFO-tier feature" }` for non-CFO users.

---

## 17. Switching mock → real

1. Set `VITE_USE_MOCK_API=false` in `.env.local`
2. Set `VITE_API_BASE_URL` to your Laravel origin
3. The adapter `index.ts` in each feature automatically selects the real adapter

No code changes required. Every feature's `src/features/{feature}/services/index.ts` reads `ENV.USE_MOCK_API` to choose the adapter.

---

## 18. Error handling

The centralized `handleApiError()` in `src/services/apiError.ts` converts Axios errors into typed `ApiError` instances. Field validation errors from Laravel's `422` response are available via `error.fieldErrors`.

```typescript
import { ApiError } from '@/services/apiError';

try {
  await someAdapter.doThing();
} catch (e) {
  if (e instanceof ApiError && e.isValidation) {
    // e.fieldErrors: Record<string, string[]>
  }
}
```

---

## 19. Tier gating

- `RequireTier` guard (`src/app/guards/RequireTier.tsx`) — wraps routes; redirects to `/billing` if tier insufficient
- `FeatureGate` component (`src/components/ui/FeatureGate.tsx`) — inline lock, renders `LockedCard` fallback
- `useTierAccess(required)` hook — returns boolean; used in `AppLayout` to show/hide ARIA nav item

Tier ranks: `compass (0) < navigator (1) < cfo (2)`.

---

## 20. Premium feature assumptions (not implemented)

These are UI shells only. The backend contracts are described above but the following providers are **not** wired:

| Feature | Provider contract |
|---|---|
| OCR | POST multipart upload, async processing, polling |
| ARIA | POST message, streaming or synchronous response |
| Email parser | Server-side; `source: "email_parser"` on expenses |
| Billing / Stripe | `/billing` is a shell; no Stripe SDK integrated |
