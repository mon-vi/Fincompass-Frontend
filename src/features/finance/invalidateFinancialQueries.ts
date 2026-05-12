import type { QueryClient } from '@tanstack/react-query';

/**
 * All query key prefixes that depend on the user's financial data.
 * After any income / debt / expense mutation the backend recalculates
 * budget, health-score, guidance, action-plan, and timeline automatically.
 * Invalidating these keys in one shot keeps every page in sync.
 */
export const FINANCIAL_QUERY_KEYS = [
  ['dashboard'],
  ['income'],
  ['debts'],
  ['expenses'],
  ['budget'],
  ['health-score'],
  ['guidance'],
  ['action-plan'],
  ['timeline'],
  ['notifications'],
] as const satisfies ReadonlyArray<readonly string[]>;

/**
 * Fire-and-forget invalidation of every finance-related query.
 * Call this in the `onSuccess` handler of any mutation that changes
 * income, debt, expense, OCR, or email-parser data.
 */
export function invalidateFinancialQueries(qc: QueryClient): void {
  for (const queryKey of FINANCIAL_QUERY_KEYS) {
    void qc.invalidateQueries({ queryKey });
  }
}
