# Phase 5 Integration

## Current Production Notes

Phase 5 now runs against real Laravel adapters in production paths. Runtime mock adapters are not used by feature service indexes.

The frontend also includes the production hardening added after backend contract alignment:

- Date rendering is defensive via `safeFormatDate` / `formatDate` in `src/utils/formatters.ts`.
- Invalid, null, undefined, or empty date values render as `—` instead of throwing `RangeError: Invalid time value`.
- Billing, ARIA, timeline, OCR, email parser, dashboard, action plan, health score, and notifications avoid forcing missing dates into invalid `Date` instances.
- React Router uses `RouteErrorBoundary` to show a friendly recovery screen with dashboard and reload actions.

## Endpoints Wired

| Flow | Endpoints |
|---|---|
| Dashboard | `GET /api/v1/dashboard` |
| Onboarding persistence | `POST /api/v1/income`, `POST /api/v1/debts`, `POST /api/v1/expenses/bulk`, `POST /api/v1/onboarding/advance` |
| Post-onboarding generation | `POST /api/v1/budget/calculate`, `POST /api/v1/guidance/generate`, `POST /api/v1/action-plan/generate`, `POST /api/v1/health-score/generate`, `POST /api/v1/timeline/generate` |
| OCR | `POST /api/v1/ocr/uploads`, `GET /api/v1/ocr/uploads/{id}`, `PATCH /api/v1/ocr/uploads/{id}/confirm`, `PATCH /api/v1/ocr/uploads/{id}/abandon` |
| Email Parser | `GET /api/v1/email-parser/forwarding-address`, `GET /api/v1/email-parser/events`, `GET /api/v1/email-parser/events/{id}`, `PATCH /api/v1/email-parser/events/{id}/apply`, `PATCH /api/v1/email-parser/events/{id}/dismiss` |
| ARIA | `GET /api/v1/aria/conversations`, `POST /api/v1/aria/conversations`, `POST /api/v1/aria/conversations/{id}/messages`, `GET /api/v1/aria/usage` |
| Billing | `GET /api/v1/billing/subscription`, `POST /api/v1/billing/checkout`, `POST /api/v1/billing/portal` |

## OCR Flow

Users upload a PDF, PNG, JPG, or JPEG document from `OcrUploadPage`. The frontend validates file type and 10 MB max size before calling `POST /ocr/uploads` with multipart form data.

After upload, the page polls `GET /ocr/uploads/{id}` while the upload is `uploading` or `processing`. When the backend returns `review_ready`, the user is sent to `OcrReviewPage`.

The review page renders extracted expenses and debts, supports select/deselect, allows amount and description edits, and confirms selected edited items with `PATCH /ocr/uploads/{id}/confirm`. Abandon uses `PATCH /ocr/uploads/{id}/abandon`.

OCR timestamps are nullable-safe. Missing upload, processed, extracted expense, or debt due dates render with safe fallbacks instead of crashing the review route.

## Email Parser Flow

The Email Parser page shows the backend forwarding address and parsed events. Each event displays matched/unmatched state, sender metadata, and a preview of parsed data.

Apply calls `PATCH /email-parser/events/{id}/apply` and invalidates expenses and debts. Dismiss calls `PATCH /email-parser/events/{id}/dismiss` and refreshes the event list.

Email event `received_at` is optional. The page omits the timestamp when missing and uses the safe formatter when present.

## ARIA Flow

ARIA loads conversations from `GET /aria/conversations` and usage from `GET /aria/usage`. If no conversation exists, the frontend creates one with `POST /aria/conversations` before sending the first message.

Messages are sent through `POST /aria/conversations/{id}/messages`. The UI keeps the existing optimistic user message behavior and rolls back if the request fails. Usage disables input when `used >= limit`.

ARIA usage supports missing `resets_at` / `month`; the usage meter renders `—` for the reset date rather than throwing.

## Billing Flow

Billing loads the current subscription from `GET /billing/subscription`. Upgrade buttons call `POST /billing/checkout` and redirect to the returned URL. Manage subscription calls `POST /billing/portal` and redirects to the returned portal URL.

Billing subscription `current_period_ends_at` is nullable-safe. Invalid backend dates are normalized to `null` by the adapter and render safely.

## Onboarding Persistence

The backend validates actual domain records before onboarding can complete, so the frontend persists each step before calling `POST /onboarding/advance`.

| Step | Frontend action |
|---|---|
| Income | Creates an active income record with `POST /income` before advancing step 2. |
| Debt | Creates a debt record with `POST /debts` before advancing step 3 when the user reports debt. `car_loan` maps to backend `auto_loan`. |
| Expenses | Bulk creates non-zero monthly expense records with `POST /expenses/bulk` before completing step 4. `transportation` maps to backend `transport`. |
| Complete | Triggers budget, guidance, action plan, health score, and debt timeline generation, then invalidates dashboard data. |

The debt onboarding form currently captures aggregate debt, so the frontend stores it as a single `Primary onboarding debt` record with an estimated minimum payment.

## Production Build

Production builds are chunked in `vite.config.ts`:

- `react`: React, React DOM, React Router
- `query`: TanStack Query
- `forms`: React Hook Form, Hookform resolvers, Zod
- `vendor`: Axios, Zustand, and remaining vendor modules

The current validation baseline is:

- `npm run test`: 21 files / 47 tests
- `npm run lint`: passing
- `npm run build`: passing without Vite warnings

## Mock Vs Real Providers

Runtime mock adapters were removed from production feature paths. Feature service indexes now export real backend adapters directly, and mock service files were removed.

Tests mock React hooks at the test boundary only; they do not provide application runtime data.

## Known Limitations

Unmatched Email Parser events are shown but not yet linkable to a specific existing debt or expense from the UI.

ARIA conversation creation assumes `POST /aria/conversations` is available because messages require a conversation id.

OCR confirm sends edited backend-supported `fields`; backend validation remains authoritative.

Onboarding debt entry is aggregate rather than per-debt. Users can edit or add individual debts after onboarding.
