# Phase 3 — Screens, Feature Modules & API Reference

## Screen Map

| Route | Page component | Auth required | Guard |
|---|---|---|---|
| `/dashboard` | `DashboardPage` | Yes | RequireOnboarding |
| `/debts` | `DebtsPage` | Yes | RequireOnboarding |
| `/debts/add` | `AddDebtPage` | Yes | RequireOnboarding |
| `/debts/:id/edit` | `EditDebtPage` | Yes | RequireOnboarding |
| `/budget` | `BudgetPage` | Yes | RequireOnboarding |
| `/health-score` | `HealthScorePage` | Yes | RequireOnboarding |
| `/timeline` | `TimelinePage` | Yes | RequireOnboarding |
| `/action-plan` | `ActionPlanPage` | Yes | RequireOnboarding |
| `/notifications` | `NotificationsPage` | Yes | RequireOnboarding |
| `/profile` | `ProfilePage` | Yes | RequireOnboarding |
| `/settings` | `ProfilePage` (alias) | Yes | RequireOnboarding |
| `/billing` | `BillingPage` | Yes | RequireOnboarding |

All Phase 3 routes are children of `AppLayout`, which renders the responsive sidebar navigation.

---

## Feature Module Map

Each feature follows the same directory structure:

```
src/features/{feature}/
  services/
    {feature}Api.ts       # TypeScript interface + types
    {feature}Mock.ts      # Mock implementation
    index.ts              # Adapter export (swap mock → real here)
  hooks/
    use{Feature}.ts       # TanStack Query useQuery/useMutation hooks
    index.ts
  components/
    {Component}.tsx       # Presentational components (no direct API calls)
    index.ts
  validation/             # Zod schemas (debts feature only in Phase 3)
    index.ts
```

### Features built in Phase 3

| Feature | Adapter key | Hooks | Notes |
|---|---|---|---|
| `dashboard` | `dashboardAdapter` | `useDashboard` | Aggregate GET — single endpoint |
| `debts` | `debtsAdapter` | `useDebts`, `useDebt`, `useCreateDebt`, `useUpdateDebt`, `useDeleteDebt`, `useMarkDebtPaid` | Full CRUD |
| `budget` | `budgetAdapter` | `useBudget`, `useUpdateBudget` | Read + update |
| `health-score` | `healthScoreAdapter` | `useHealthScore` | Read only |
| `timeline` | `timelineAdapter` | `useTimeline` | Strategy + extra-payment state held in hook |
| `action-plan` | `actionPlanAdapter` | `useActionPlan`, `useToggleActionItem` | Read + toggle complete |
| `guidance` | `guidanceAdapter` | `useGuidance`, `useDismissGuidance` | Read + dismiss |
| `notifications` | `notificationsAdapter` | `useNotifications`, `useMarkNotificationRead`, `useMarkAllNotificationsRead` | Read + mark-read |

---

## API Expectations by Screen

### Dashboard — `GET /api/v1/dashboard`

Assumed response shape:
```json
{
  "financialSummary": {
    "monthlyIncome": 4500,
    "monthlyExpenses": 2505,
    "monthlyDebtPayments": 700,
    "netCashFlow": 1295
  },
  "budgetSnapshot": {
    "totalBudgeted": 2650,
    "totalSpent": 2505,
    "overBudgetCategories": ["Food & Dining"]
  },
  "healthScore": { "score": 64, "grade": "C", "trend": "improving" },
  "actionPlan": { "total": 5, "completed": 2, "nextActionTitle": "..." },
  "topGuidance": [{ "id": "...", "title": "...", "body": "...", "type": "warning|insight|tip" }],
  "dueSoon": [{ "id": "...", "name": "...", "minimumPayment": 200, "daysUntilDue": 3 }]
}
```

### Debts — `GET /api/v1/debts`

```json
[{
  "id": "string",
  "name": "string",
  "type": "credit_card|student_loan|personal_loan|auto_loan|mortgage|medical|other",
  "balance": 8500,
  "originalBalance": 11000,
  "interestRate": 22.99,
  "minimumPayment": 200,
  "dueDayOfMonth": 15,
  "isPaid": false,
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601"
}]
```

`POST /api/v1/debts` — accepts all fields except `id`, `isPaid`, timestamps.  
`PATCH /api/v1/debts/{id}` — partial update, same fields.  
`DELETE /api/v1/debts/{id}` — no body, no response body.  
`POST /api/v1/debts/{id}/mark-paid` — returns updated Debt object.

### Budget — `GET /api/v1/budget`

```json
{
  "month": "2026-04",
  "totalBudgeted": 2650,
  "totalSpent": 2505,
  "categories": [{
    "id": "string",
    "name": "string",
    "budgeted": 1200,
    "spent": 1200,
    "icon": "🏠"
  }]
}
```

`POST /api/v1/budget` — accepts `{ month, categories: [{ id, budgeted }] }`.

### Health Score — `GET /api/v1/health-score`

```json
{
  "score": 64,
  "grade": "C",
  "trend": "improving",
  "breakdown": {
    "debtToIncome": { "score": 48, "label": "Debt-to-Income Ratio", "value": "31%", "weight": 35 },
    "savingsRate": { "score": 62, "label": "Savings Rate", "value": "12%", "weight": 25 },
    "paymentHistory": { "score": 90, "label": "Payment History", "value": "On time", "weight": 25 },
    "budgetAdherence": { "score": 55, "label": "Budget Adherence", "value": "94.5%", "weight": 15 }
  },
  "lastUpdated": "ISO8601",
  "history": [{ "month": "2026-04", "score": 64 }]
}
```

### Timeline — `GET /api/v1/timeline?strategy=avalanche`

Query params: `strategy` (`minimum|avalanche|snowball`), optionally `extraPayment` (number).

```json
{
  "strategy": "avalanche",
  "totalInterestPaid": 8190,
  "totalPaid": 51690,
  "payoffDate": "2029-04-01",
  "totalMonths": 36,
  "extraPayment": 0,
  "debts": [{
    "debtId": "string",
    "debtName": "string",
    "payoffDate": "ISO8601",
    "payoffMonth": 18,
    "totalPaid": 10820,
    "interestPaid": 2320
  }],
  "monthlySnapshots": [{
    "month": 1,
    "date": "2026-05-01",
    "totalBalance": 43500,
    "totalPayment": 700,
    "totalInterest": 228
  }]
}
```

### Action Plan — `GET /api/v1/action-plan`

```json
[{
  "id": "string",
  "title": "string",
  "description": "string",
  "category": "debt|budget|savings|income",
  "priority": "high|medium|low",
  "isCompleted": false,
  "completedAt": null,
  "dueDate": null,
  "createdAt": "ISO8601"
}]
```

`PATCH /api/v1/action-plan/{id}` — accepts `{ isCompleted: boolean }`.

### Guidance — `GET /api/v1/guidance`

```json
[{
  "id": "string",
  "title": "string",
  "body": "string",
  "type": "tip|warning|insight",
  "isDismissed": false,
  "createdAt": "ISO8601"
}]
```

`PATCH /api/v1/guidance/{id}/dismiss` — no body, no response body.

### Notifications — `GET /api/v1/notifications`

```json
[{
  "id": "string",
  "title": "string",
  "body": "string",
  "type": "payment_due|budget_exceeded|milestone|tip|system",
  "isRead": false,
  "createdAt": "ISO8601"
}]
```

`PATCH /api/v1/notifications/{id}/read` — no body, no response body.  
`POST /api/v1/notifications/read-all` — no body, no response body.

---

## Backend Endpoint Assumptions (confirm before writing real adapters)

| # | Endpoint | Assumption | Risk if wrong |
|---|---|---|---|
| 1 | `GET /api/v1/dashboard` | Returns a single aggregate object | May need to compose from separate endpoints |
| 2 | `GET /api/v1/budget` | Returns current month by default | May require `?month=YYYY-MM` param |
| 3 | `PATCH /api/v1/debts/{id}` | Accepts partial payload | May require full PUT instead |
| 4 | `POST /api/v1/debts/{id}/mark-paid` | Returns updated Debt object | May return `{ success: true }` |
| 5 | `GET /api/v1/timeline?strategy=` | `extraPayment` is an optional query param | May be POST body |
| 6 | `GET /api/v1/health-score` | Includes `history` array in response | May be a separate `GET /api/v1/health-score/history` |
| 7 | `GET /api/v1/guidance` | Filters out already-dismissed items server-side | May return all, requiring client-side filter |
| 8 | Budget `icon` field | Backend returns emoji string | May not exist; icon may be determined by `name` on frontend |

---

## Mock Data Strategy

All Phase 3 mock adapters live in `src/features/{feature}/services/{feature}Mock.ts`.

The mock data tells a coherent story of a single user persona:
- **Income**: $4,500/month (salary)
- **Debts**: Chase Freedom Visa ($8,500/22.99%), Toyota Auto ($12,000/6.9%), Student Loan ($23,000/5.5%)
- **Budget**: Food over budget ($620 vs $500 budgeted), overall $2,505 of $2,650
- **Health score**: 64/C, trending up from 55 six months ago
- **Action plan**: 2/5 items complete; high-priority items relate to debt and budget

Mutable mock state (debts, action items, notifications, guidance) uses module-level arrays so mutations persist for the session. The data resets on browser refresh (no IndexedDB/localStorage persistence in mock layer by design).

To switch to a real adapter for any feature:
1. Create `src/features/{feature}/services/{feature}Real.ts` implementing the adapter interface.
2. Swap the adapter in `src/features/{feature}/services/index.ts`:
   ```typescript
   export const {feature}Adapter = ENV.USE_MOCK_API ? {feature}Mock : {feature}Real;
   ```

---

## Navigation

The `AppLayout` component renders a persistent left sidebar on desktop (≥ lg breakpoint) and a hamburger-triggered slide-out drawer on mobile. No bottom tab bar — the sidebar collapses to a top strip with a menu button.

Sidebar sections:
1. **Main**: Dashboard, Debts, Budget, Health Score, Timeline, Action Plan, Notifications
2. **Account**: Profile, Billing
3. **Footer**: user name + tier, Sign out

The notification bell in the sidebar (and mobile top bar) shows a live unread count badge via `useNotifications()`.

---

## What Remains for Phase 4

| Area | Work |
|---|---|
| **Expenses** | CRUD for `GET/POST /api/v1/expenses` and bulk import (`POST /api/v1/expenses/bulk`) |
| **Budget editing** | Form to update category budgets (`POST /api/v1/budget`) |
| **Token refresh** | Silent 401 → refresh → retry flow in `src/services/apiClient.ts` |
| **Real adapters** | `authReal.ts`, `onboardingReal.ts`, and all Phase 3 `*Real.ts` adapters |
| **Profile editing** | Name/email/password change endpoints (not yet defined in backend) |
| **Billing portal** | Stripe or equivalent integration for plan upgrades |
| **ARIA shell** | CFO-tier AI assistant UI (endpoint TBD with backend) |
| **Push notifications** | Web push subscription + service worker |
| **Error boundaries** | Per-route error boundaries wrapping each page |
| **Pagination** | Debts, notifications, guidance lists may need cursor/page params |
