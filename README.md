# FinCompass — Web Frontend

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

# 4. Start dev server
npm run dev
```

App runs at `http://localhost:5173`.

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8000/api/v1` |
| `VITE_API_TIMEOUT` | Request timeout in ms | `10000` |
| `VITE_APP_ENV` | `development` / `production` | `development` |
| `VITE_FEATURE_OCR` | Enable OCR upload (CFO tier) | `false` |
| `VITE_FEATURE_EMAIL_PARSING` | Enable email parsing | `false` |
| `VITE_FEATURE_ARIA_CHAT` | Enable ARIA chat (CFO tier) | `false` |

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
├── features/          # Feature-scoped modules (auth, budget, debts, …)
├── hooks/             # Shared React hooks
├── layouts/           # AppLayout, AuthLayout
├── pages/             # Route-level page components
├── services/          # API client and service modules
├── stores/            # Zustand stores
├── test/              # Test setup (Vitest + Testing Library)
├── types/             # Shared TypeScript types
├── utils/             # Pure utility functions
└── validation/        # Zod schemas
```

## Architecture Notes

- **API client** (`src/services/apiClient.ts`): Axios with request interceptors for auth tokens and a 401 handler that clears auth and redirects to `/login`. Token refresh added in Phase 2.
- **Auth state** (`src/stores/authStore.ts`): Zustand with `persist` middleware. Persists `user` + `isAuthenticated` to `localStorage`; raw tokens stored separately as plain strings.
- **Route guards**: Three composable guards — `RequireAuth` (must be logged in), `RequireOnboarding` (onboarding complete), `RedirectIfAuth` (logged-in users can't visit login/register).
- **Environment variables**: All accessed through `src/constants/env.ts` — never read `import.meta.env` directly in components.
- **Zod validation**: Auth schemas in `src/validation/auth.ts`; feature-specific schemas added alongside their feature modules.

## Phase Status

| Phase | Status | Description |
|---|---|---|
| 1 | ✅ Complete | Foundation, UI library, routing structure |
| 2 | Pending | Auth (login, register, onboarding) |
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
