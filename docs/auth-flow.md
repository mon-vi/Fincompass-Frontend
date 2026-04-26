# Auth Flow — Assumptions & Design

## Overview

Authentication is handled by the `src/features/auth/` module. It follows an adapter pattern so the mock implementation can be swapped for the real Laravel API without changing any page or hook code.

## Flows

### Sign Up (`/register`)
1. User submits `firstName`, `lastName`, `email`, `password`, `confirmPassword`.
2. Zod validates on the client (password strength, email format, match).
3. `useRegister` mutation calls `authAdapter.register()`.
4. On success: `setAuth(user, tokens)` → persist to Zustand + localStorage → navigate to `/onboarding`.
5. New accounts always start with `onboardingStatus: 'pending'`.

### Sign In (`/login`)
1. User submits `email` + `password`.
2. `useLogin` mutation calls `authAdapter.login()`.
3. On success: `setAuth(user, tokens)` → navigate to `/onboarding` if `onboardingStatus === 'pending'`, otherwise `/dashboard`.

### Forgot Password (`/forgot-password`)
1. User submits email.
2. `useForgotPassword` mutation calls `authAdapter.forgotPassword(email)`.
3. Response is always a success message regardless of whether the email exists (prevents enumeration).
4. The form hides after success and shows a confirmation alert.

### Reset Password (`/reset-password?token=…`)
1. The `token` query parameter is extracted from the URL (provided by the reset email link).
2. User submits `password` + `confirmPassword`.
3. `useResetPassword` mutation calls `authAdapter.resetPassword(token, password)`.
4. On success: navigate to `/login` with a clean state.
5. Missing token: shows an error card with a link to request a new reset.

### Sign Out
1. `useLogout` hook (from `src/features/auth/hooks/useLogout.ts`) calls `authAdapter.logout()` (fire-and-forget on error).
2. Regardless of API response: `clearAuth()` → remove tokens from localStorage → navigate to `/login`.
3. The logout button lives in `AppLayout` header and is visible on all protected routes.

## Token Storage

| Item | Key | Storage |
|---|---|---|
| Access token | `fincompass:access_token` | `localStorage` |
| Refresh token | `fincompass:refresh_token` | `localStorage` |
| User + auth state | `fincompass:auth` | `localStorage` (via Zustand persist) |

## Token Refresh

Token refresh is **not yet implemented**. The current flow:
- All requests attach the access token via Axios request interceptor.
- On a `401` response, the Axios response interceptor clears all auth state and hard-redirects to `/login`.
- **Phase 3 task**: implement silent token refresh before the 401 handler clears state.

## Laravel API Assumptions

The following endpoints are expected when integrating:

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/v1/auth/register` | Register new user |
| `POST` | `/api/v1/auth/login` | Login |
| `POST` | `/api/v1/auth/forgot-password` | Send reset email |
| `POST` | `/api/v1/auth/reset-password` | Reset password |
| `POST` | `/api/v1/auth/logout` | Invalidate token server-side |
| `POST` | `/api/v1/auth/refresh` | Refresh access token (Phase 3) |

**Response shape for login/register:**
```json
{
  "user": {
    "id": "uuid",
    "email": "...",
    "firstName": "...",
    "lastName": "...",
    "tier": "compass",
    "onboardingStatus": "pending",
    "createdAt": "ISO8601",
    "updatedAt": "ISO8601"
  },
  "tokens": {
    "accessToken": "...",
    "refreshToken": "...",
    "expiresIn": 3600
  }
}
```

## Mock Adapter

Located at `src/features/auth/services/authMock.ts`.

- Accepts `demo@fincompass.app` / `Password1` for login.
- Any other credentials throw `"Invalid email or password"`.
- `taken@fincompass.app` throws a duplicate email error on register.
- Reset token `"invalid"` throws an expired-link error.
- All operations add an artificial 800 ms delay to simulate network latency.
