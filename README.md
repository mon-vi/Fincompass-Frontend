'# FinCompass — Web Frontend

Personal finance guidance platform. React + Vite + TypeScript.

## Tech Stack

| Layer | Library |
|---|---|
| Framework | React 19 + Vite |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| Server state | TanStack Query v5 |
| Client state | Zustand v5 |
| Forms | React Hook Form + Zod |
| HTTP | Axios |
| Testing | Vitest + Testing Library |

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env.local

# 3. Edit .env.local — set VITE_API_BASE_URL to your backend URL
#    Leave VITE_API_BASE_URL unset (or set VITE_USE_MOCK_API=true) to use mock data

# 4. Start dev server
npm run dev
```

App runs at `http://localhost:5173`.

**Quick demo login:** `demo@fincompass.app` / `Password1`

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Backend API base URL | *(unset = mock mode)* |
| `VITE_USE_MOCK_API` | Force mock adapters even with API URL set | `false` |
| `VITE_API_TIMEOUT` | Request timeout in ms | `10000` |
| `VITE_APP_ENV` | `development` / `production` | `development` |
| `VITE_FEATURE_OCR` | Enable OCR upload (CFO tier) | `false` |
| `VITE_FEATURE_EMAIL_PARSING` | Enable email parsing | `false` |
| `VITE_FEATURE_ARIA_CHAT` | Enable ARIA chat (CFO tier) | `false` |

When `VITE_API_BASE_URL` is not set, the app automatically uses mock API adapters. See `docs/api-integration.md` for switching to the real Laravel backend.

## Scripts

```bash
npm run dev           # Start dev server
npm run build         # Type-check + production build
npm run preview       # Serve production build locally
npm run lint          # ESLint
npm run lint:fix      # ESLint with auto-fix
npm run format        # Prettier write
npm run format:check  # Prettier check (CI)
npm run test          # Run tests once
npm run test:watch    # Watch mode
npm run test:ui       # Vitest UI
npm run test:coverage # Coverage report
npm run typecheck     # TypeScript check without emitting
```

## Folder Structure

```
src/
├── app/               # App shell — router, providers, error boundary, route guards
│   ├── guards/        # Auth guards: RequireAuth, RequireOnboarding, RedirectIfAuth
│   ├── router.tsx     # Route tree
│   ├── providers.tsx  # Global provider tree (QueryClient, etc.)
│   └── ErrorBoundary.tsx
├── components/
│   └── ui/            # Reusable design-system primitives
├── constants/         # Route paths, env config, shared constants
├── features/
│   ├── auth/          # Auth feature module
│   │   ├── components/   # PasswordInput
│   │   ├── hooks/        # useLogin, useRegister, useForgotPassword, useResetPassword, useLogout
│   │   └── services/     # authApi interface + authMock adapter
│   └── onboarding/    # Onboarding feature module
│       ├── components/   # ProgressIndicator, StepNavigation
│       ├── hooks/        # useOnboarding
│       ├── services/     # onboardingApi interface + onboardingMock adapter
│       ├── steps/        # GoalSelectionStep, IncomeSetupStep, DebtSetupStep, ExpenseSetupStep
│       ├── store/        # onboardingStore (Zustand, persisted)
│       └── validation/   # Zod schemas for all 4 steps
├── hooks/             # Shared React hooks
├── layouts/           # AppLayout (with logout), AuthLayout
├── pages/
│   ├── auth/          # LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage
│   ├── dashboard/     # DashboardPage (Phase 3 placeholder)
│   └── onboarding/    # OnboardingPage (multi-step orchestrator)
├── services/          # Axios API client
├── stores/            # authStore (Zustand, persisted)
├── test/              # Test setup
├── types/             # Shared TypeScript types
├── utils/             # cn(), formatters
└── validation/        # Shared Zod schemas (auth forms)
```

## Route Map

| Path | Access | Component |
|---|---|---|
| `/login` | Public (redirects if authed) | LoginPage |
| `/register` | Public (redirects if authed) | RegisterPage |
| `/forgot-password` | Public (redirects if authed) | ForgotPasswordPage |
| `/reset-password?token=…` | Public (redirects if authed) | ResetPasswordPage |
| `/onboarding` | Auth required | OnboardingPage (4 steps) |
| `/dashboard` | Auth + onboarding complete | DashboardPage |

## Architecture Notes

- **API client** (`src/services/apiClient.ts`): Axios with request interceptors for auth tokens and a 401 handler that clears auth and redirects to `/login`.
- **Auth state** (`src/stores/authStore.ts`): Zustand with `persist` middleware. Persists `user` + `isAuthenticated` to `localStorage`; raw tokens stored separately under `fincompass:access_token` / `fincompass:refresh_token`.
- **Auth feature** (`src/features/auth/`): Clean adapter pattern — `AuthApiAdapter` interface with `authMock` implementation. Swap in the real Laravel adapter by updating `services/index.ts`.
- **Onboarding state** (`src/features/onboarding/store/`): Zustand with `persist` under `fincompass:onboarding`. Resume-safe: users can close the browser mid-flow and their step data is restored.
- **Route guards**: Three composable guards — `RequireAuth`, `RequireOnboarding`, `RedirectIfAuth`.
- **Environment variables**: All accessed through `src/constants/env.ts` — never read `import.meta.env` directly in components.
- **Mock API**: Enabled automatically when `VITE_API_BASE_URL` is unset. All mock adapters add artificial network delay (800 ms) to simulate real latency.

## Phase Status

| Phase | Status | Description |
|---|---|---|
| 1 | ✅ Complete | Foundation, UI library, routing structure |
| 2 | ✅ Complete | Auth flows, onboarding multi-step flow |
| 3 | Pending | Dashboard, health score, budget |
| 4 | Pending | Debts, expenses, action plan |
| 5 | Pending | OCR upload, email parsing |
| 6 | Pending | ARIA chat (CFO tier) |

## Testing

Tests live alongside the source files (`*.test.ts` / `*.test.tsx`).

```bash
npm run test          # single run
npm run test:watch    # watch mode during development
npm run test:coverage # coverage report in coverage/
```

## Further Reading

- [docs/auth-flow.md](docs/auth-flow.md) — Auth assumptions and token lifecycle
- [docs/onboarding-flow.md](docs/onboarding-flow.md) — Onboarding step structure and resume behaviour
- [docs/api-integration.md](docs/api-integration.md) — Switching from mock to real Laravel API
