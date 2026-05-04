# FinCompass Frontend

React, Vite, and TypeScript frontend for the FinCompass personal finance platform.

## Current State

- Uses the real Laravel API adapters by default. Runtime mock adapters are no longer part of production feature paths.
- Onboarding persists real income, debt, and expense records before advancing steps.
- Dashboard, budget, health score, timeline, action plan, guidance, billing, OCR, email parser, and ARIA are wired to backend endpoints.
- Date rendering is defensive. Invalid, null, or missing backend dates render as a fallback instead of crashing the route.
- React Router has a friendly route error boundary with dashboard and reload recovery actions.
- Vercel SPA rewrites are configured in `vercel.json`.

## Tech Stack

| Layer | Library |
|---|---|
| Framework | React 19 + Vite 8 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| Server state | TanStack Query v5 |
| Client state | Zustand v5 |
| Forms | React Hook Form + Zod |
| HTTP | Axios |
| Testing | Vitest + Testing Library |

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set `VITE_API_BASE_URL` in `.env.local` to the deployed Laravel backend origin:

```bash
VITE_API_BASE_URL=https://fincompass-backend.onrender.com
```

The dev server runs at `http://localhost:5173`.

`VITE_API_BASE_URL` should normally be the backend origin only. If someone accidentally includes `/api/v1`, the frontend normalizes it away before endpoint constants add `/api/v1`, so requests do not become `/api/v1/api/v1/...`.

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Laravel backend origin used by Axios | Required for real API calls |
| `VITE_API_TIMEOUT` | Request timeout in milliseconds | `10000` |
| `VITE_APP_NAME` | Display/app name | `FinCompass` |
| `VITE_APP_ENV` | App environment label | `development` |
| `VITE_FEATURE_OCR` | Optional OCR feature flag | `false` |
| `VITE_FEATURE_EMAIL_PARSING` | Optional email parser feature flag | `false` |
| `VITE_FEATURE_ARIA_CHAT` | Optional ARIA feature flag | `false` |

## Scripts

```bash
npm run dev           # Start Vite dev server
npm run build         # Type-check and build production assets
npm run preview       # Serve the production build locally
npm run lint          # Run ESLint
npm run lint:fix      # Run ESLint with auto-fix
npm run format        # Run Prettier write
npm run format:check  # Check Prettier formatting
npm run test          # Run tests once
npm run test:watch    # Run tests in watch mode
npm run test:ui       # Open Vitest UI
npm run test:coverage # Generate coverage report
npm run typecheck     # TypeScript check without emitting
```

## Production Build

```bash
npm run test
npm run lint
npm run build
```

The Vite build is chunked into React, query, forms, vendor, and app bundles to keep production output clean. Generated `dist/` assets and `node_modules/` are ignored by `.gitignore`.

## Local, Vercel, and Render Integration

Both local development and Vercel production should use the same deployed backend:

```bash
VITE_API_BASE_URL=https://fincompass-backend.onrender.com
```

Expected final frontend request URLs include:

```text
https://fincompass-backend.onrender.com/api/v1/auth/login
https://fincompass-backend.onrender.com/api/v1/auth/register
https://fincompass-backend.onrender.com/api/v1/dashboard
```

For Vercel, set `VITE_API_BASE_URL` in the project environment variables for Production, Preview, and Development as needed. Vite bakes this value into the build.

The Render backend should allow both frontend origins:

```bash
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://fincompass-frontend.vercel.app
SANCTUM_STATEFUL_DOMAINS=localhost,localhost:5173,127.0.0.1,fincompass-frontend.vercel.app
FRONTEND_URL=https://fincompass-frontend.vercel.app
```

Adding `localhost` to CORS/stateful domain configuration does not break production. It only allows browser requests from local development while the production Vercel origin remains allowed.

`vercel.json` rewrites all routes to `/index.html`, so direct visits to `/login`, `/register`, `/dashboard`, and other React Router paths should not return Vercel 404s.

## Route Map

| Path | Access | Page |
|---|---|---|
| `/login` | Public, redirects if authenticated | Login |
| `/register` | Public, redirects if authenticated | Register |
| `/forgot-password` | Public, redirects if authenticated | Forgot password |
| `/reset-password` | Public, redirects if authenticated | Reset password |
| `/onboarding` | Authenticated incomplete profile | Onboarding |
| `/dashboard` | Authenticated and onboarded | Dashboard |
| `/debts` | Authenticated and onboarded | Debts |
| `/debts/add` | Authenticated and onboarded | Add debt |
| `/debts/:id/edit` | Authenticated and onboarded | Edit debt |
| `/budget` | Authenticated and onboarded | Budget |
| `/expenses` | Authenticated and onboarded | Expenses |
| `/expenses/ocr` | Navigator tier | OCR upload |
| `/expenses/ocr/review/:id` | Navigator tier | OCR review |
| `/email-parser` | Navigator tier | Email parser |
| `/health-score` | Authenticated and onboarded | Health score |
| `/timeline` | Authenticated and onboarded | Payoff timeline |
| `/action-plan` | Authenticated and onboarded | Action plan |
| `/notifications` | Authenticated and onboarded | Notifications |
| `/profile` | Authenticated and onboarded | Profile |
| `/settings` | Authenticated and onboarded | Profile/settings |
| `/billing` | Authenticated and onboarded | Billing |
| `/aria` | CFO tier | ARIA assistant |

## Architecture Notes

- API endpoints are centralized in `src/config/endpoints.ts`.
- Axios lives in `src/services/apiClient.ts`, attaches the Sanctum bearer token from local storage, and clears auth on `401`.
- Auth state lives in `src/stores/authStore.ts`; the bearer token key is `fincompass:token`.
- Feature adapters map Laravel snake_case resources to frontend camelCase view models.
- Onboarding uses `src/features/onboarding/hooks/useOnboarding.ts` to persist domain records before advancing server onboarding state.
- Onboarding completion triggers budget, guidance, action plan, health score, and timeline generation where applicable.
- Date helpers live in `src/utils/formatters.ts`; use `safeFormatDate` or `formatDate`, not direct render-time `new Date(...).toLocale...` calls.
- Route-level failures render `src/app/RouteErrorBoundary.tsx` instead of React Router's default crash screen.

## Onboarding Persistence

Each onboarding step writes backend domain data before advancing:

| Step | Backend persistence |
|---|---|
| Income | `POST /api/v1/income` |
| Debt | `POST /api/v1/debts` when the user has debt |
| Expenses | `POST /api/v1/expenses/bulk` for non-zero monthly expenses |
| Completion | `POST /budget/calculate`, `POST /guidance/generate`, `POST /action-plan/generate`, `POST /health-score/generate`, and `POST /timeline/generate` when debts exist |

## Testing

Tests live beside source files as `*.test.ts` and `*.test.tsx`.

Current validation baseline:

- `npm run test`: 21 files / 47 tests
- `npm run lint`: passing
- `npm run build`: passing

## Further Reading

- [docs/auth-flow.md](docs/auth-flow.md)
- [docs/onboarding-flow.md](docs/onboarding-flow.md)
- [docs/api-integration.md](docs/api-integration.md)
- [docs/deployment.md](docs/deployment.md)
- [docs/phase3-screens.md](docs/phase3-screens.md)
- [docs/phase4-integration.md](docs/phase4-integration.md)
- [docs/phase5-integration.md](docs/phase5-integration.md)
