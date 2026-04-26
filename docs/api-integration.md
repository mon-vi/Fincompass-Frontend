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

```typescript
// src/features/onboarding/services/onboardingReal.ts
import { post } from '@/services/apiClient';
import type { OnboardingApiAdapter, OnboardingPayload } from './onboardingApi';

export const onboardingReal: OnboardingApiAdapter = {
  submit: (payload: OnboardingPayload) => post('/onboarding', payload),
};
```

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

### Onboarding endpoint

```json
// POST /onboarding — body
{
  "goals": ["pay_off_debt", "emergency_fund"],
  "income": {
    "monthlyIncome": 4000,
    "incomeType": "salary"
  },
  "debts": {
    "hasDebts": true,
    "totalDebtBalance": 15000,
    "averageInterestRate": 18.5,
    "primaryDebtType": "credit_card"
  },
  "expenses": {
    "housing": 1200,
    "transportation": 400,
    "food": 600,
    "utilities": 150,
    "other": 200
  }
}

// Response: 204 No Content or updated user object
```

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
