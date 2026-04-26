# API Integration — Switching from Mock to Laravel

## Current State

All API calls in Phase 2 use mock adapters that simulate network responses locally with artificial delays. No real backend calls are made.

The mock adapters are:
- `src/features/auth/services/authMock.ts`
- `src/features/onboarding/services/onboardingMock.ts`

## Adapter Pattern

Each feature exposes an interface and an active adapter:

```typescript
// src/features/auth/services/index.ts
export const authAdapter: AuthApiAdapter = ENV.USE_MOCK_API ? authMock : authMock;
//                                                        ^mock    ^swap with authReal
```

To integrate the real Laravel API:
1. Create `src/features/auth/services/authReal.ts` implementing `AuthApiAdapter`.
2. Update `src/features/auth/services/index.ts` to swap the adapter.
3. Repeat for `onboarding`.

## Switching to Real API

### Step 1 — Set the environment variable

```bash
# .env.local
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

Once `VITE_API_BASE_URL` is set, `ENV.USE_MOCK_API` evaluates to `false` automatically (unless you also set `VITE_USE_MOCK_API=true`).

### Step 2 — Create the real auth adapter

```typescript
// src/features/auth/services/authReal.ts
import { post } from '@/services/apiClient';
import type { AuthApiAdapter, AuthResponse, MessageResponse } from './authApi';

export const authReal: AuthApiAdapter = {
  login: (payload) => post<AuthResponse>('/auth/login', payload),
  register: (payload) => post<AuthResponse>('/auth/register', payload),
  forgotPassword: (email) => post<MessageResponse>('/auth/forgot-password', { email }),
  resetPassword: (token, password) =>
    post<MessageResponse>('/auth/reset-password', { token, password }),
  logout: () => post('/auth/logout'),
};
```

### Step 3 — Wire it up

```typescript
// src/features/auth/services/index.ts
import { authReal } from './authReal';

export const authAdapter: AuthApiAdapter = ENV.USE_MOCK_API ? authMock : authReal;
```

### Step 4 — Repeat for onboarding

The backend exposes two onboarding endpoints (not the single `POST /onboarding` that was originally assumed):

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/v1/onboarding` | Fetch current server-side onboarding progress |
| `POST` | `/api/v1/onboarding/advance` | Submit one step's data and advance to the next |

Create `src/features/onboarding/services/onboardingReal.ts` implementing `OnboardingApiAdapter`:

```typescript
// src/features/onboarding/services/onboardingReal.ts
import { get, post } from '@/services/apiClient';
import type {
  AdvancePayload,
  AdvanceResponse,
  OnboardingApiAdapter,
  OnboardingStatusResponse,
} from './onboardingApi';

export const onboardingReal: OnboardingApiAdapter = {
  getStatus: () => get<OnboardingStatusResponse>('/onboarding'),
  advance: (payload: AdvancePayload) =>
    post<AdvanceResponse>('/onboarding/advance', payload),
};
```

Then wire it in `src/features/onboarding/services/index.ts`:

```typescript
import { onboardingReal } from './onboardingReal';

export const onboardingAdapter: OnboardingApiAdapter = ENV.USE_MOCK_API
  ? onboardingMock
  : onboardingReal;
```

#### Open questions — confirm with backend before writing onboardingReal.ts

| # | Question | Frontend assumption |
|---|---|---|
| 1 | Does `POST /onboarding/advance` accept `{ step, data }` or the step data directly? | `{ step: 1 \| 2 \| 3 \| 4, data: <step-data> }` |
| 2 | What is the exact shape of `GET /onboarding` response? | `{ currentStep, completedSteps }` |
| 3 | Does `POST /onboarding/advance` return `{ nextStep, onboardingStatus }` or just the user object? | `{ nextStep: number \| null, onboardingStatus }` |
| 4 | Is `nextStep: null` the signal for completion, or is it a separate field? | `null` = complete |

## Expected API Response Shapes

### Auth endpoints

```json
// POST /auth/login, /auth/register
{
  "user": {
    "id": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "tier": "compass | navigator | cfo",
    "onboardingStatus": "pending | complete",
    "createdAt": "ISO8601",
    "updatedAt": "ISO8601"
  },
  "tokens": {
    "accessToken": "string",
    "refreshToken": "string",
    "expiresIn": 3600
  }
}

// POST /auth/forgot-password, /auth/reset-password
{ "message": "string" }
```

### Onboarding endpoints

**GET /onboarding** — assumed response shape (confirm with backend):

```json
{ "currentStep": 1, "completedSteps": [] }
```

**POST /onboarding/advance** — assumed request body shape (confirm with backend):

```json
// Step 1
{ "step": 1, "data": { "goals": ["pay_off_debt", "emergency_fund"] } }

// Step 2
{ "step": 2, "data": { "monthlyIncome": 4000, "incomeType": "salary" } }

// Step 3
{ "step": 3, "data": { "hasDebts": true, "totalDebtBalance": 15000, "averageInterestRate": 18.5, "primaryDebtType": "credit_card" } }

// Step 4 (final)
{ "step": 4, "data": { "housing": 1200, "transportation": 400, "food": 600, "utilities": 150, "other": 200 } }
```

Assumed response for steps 1–3:

```json
{ "nextStep": 2, "onboardingStatus": "pending" }
```

Assumed response for step 4 (completion):

```json
{ "nextStep": null, "onboardingStatus": "complete" }
```

See the open questions table in the "Step 4 — Repeat for onboarding" section above — the exact shape of `step`/`data` wrapping must be confirmed with the backend before writing `onboardingReal.ts`.

## Error Handling

The Axios client (`src/services/apiClient.ts`) handles:
- **401**: clears auth state + redirects to `/login`
- **All other errors**: propagated as rejected promises → caught by TanStack Query mutations → surfaced in `isError` + `error` fields → rendered as `<Alert variant="error">` in the page component

Laravel validation errors (422) should follow this shape for field-level errors to be handled in Phase 3:
```json
{
  "message": "The email field is required.",
  "errors": {
    "email": ["The email field is required."]
  }
}
```

## Token Refresh (Phase 3)

The current interceptor on 401 immediately clears auth. Phase 3 should:
1. Detect 401 with a valid refresh token.
2. Call `POST /auth/refresh` with the refresh token.
3. Update tokens in localStorage.
4. Retry the original request.
5. Only clear auth if the refresh itself fails.

This logic belongs in `src/services/apiClient.ts` request interceptor.
