/**
 * All Laravel API endpoint paths, centralised so string literals
 * never appear scattered across adapter files.
 *
 * Prepend ENV.API_BASE_URL to produce full URLs - apiClient already
 * does this via its baseURL config.
 */
const API_VERSION = '/api/v1';

function normalizeEndpointPath(path: string): string {
  const trimmed = path.trim();
  const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return withLeadingSlash.replace(/^\/api\/v1(?=\/|$)/i, '');
}

export const API = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    ME: '/users/me',
  },
  ONBOARDING: {
    STATUS: '/onboarding',
    ADVANCE: '/onboarding/advance',
  },
  INCOME: {
    LIST: '/income',
    DETAIL: (id: string) => `/income/${id}`,
  },
  DASHBOARD: '/dashboard',
  BUDGET: '/budget',
  BUDGET_CALCULATE: '/budget/calculate',
  DEBTS: {
    LIST: '/debts',
    DETAIL: (id: string) => `/debts/${id}`,
    MARK_PAID: (id: string) => `/debts/${id}/mark-paid`,
  },
  EXPENSES: {
    LIST: '/expenses',
    DETAIL: (id: string) => `/expenses/${id}`,
    BULK: '/expenses/bulk',
  },
  HEALTH_SCORE: {
    CURRENT: '/health-score',
    HISTORY: '/health-score/history',
    GENERATE: '/health-score/generate',
  },
  TIMELINE: '/timeline',
  TIMELINE_GENERATE: '/timeline/generate',
  ACTION_PLAN: {
    LIST: '/action-plan',
    DETAIL: (id: string) => `/action-plan/${id}`,
    GENERATE: '/action-plan/generate',
  },
  GUIDANCE: {
    LIST: '/guidance',
    GENERATE: '/guidance/generate',
    DISMISS: (id: string) => `/guidance/${id}/dismiss`,
  },
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
  },
  OCR: {
    UPLOADS: '/ocr/uploads',
    DETAIL: (id: string) => `/ocr/uploads/${id}`,
    CONFIRM: (id: string) => `/ocr/uploads/${id}/confirm`,
    ABANDON: (id: string) => `/ocr/uploads/${id}/abandon`,
  },
  EMAIL_PARSER: {
    FORWARDING_ADDRESS: '/email-parser/forwarding-address',
    EVENTS: '/email-parser/events',
    EVENT: (id: string) => `/email-parser/events/${id}`,
    APPLY: (id: string) => `/email-parser/events/${id}/apply`,
    DISMISS: (id: string) => `/email-parser/events/${id}/dismiss`,
  },
  ARIA: {
    CONVERSATIONS: '/aria/conversations',
    CONVERSATION_MESSAGES: (id: string) => `/aria/conversations/${id}/messages`,
    USAGE: '/aria/usage',
  },
  BILLING: {
    SUBSCRIPTION: '/billing/subscription',
    CHECKOUT: '/billing/checkout',
    PORTAL: '/billing/portal',
  },
  PROFILE: {
    UPDATE: '/profile',
    CHANGE_PASSWORD: '/profile/password',
  },
} as const;

/** Prefix every endpoint path with the API version segment. */
export function apiPath(path: string): string {
  return `${API_VERSION}${normalizeEndpointPath(path)}`;
}

/** Build a full API URL for diagnostics/tests without duplicating version segments. */
export function apiUrl(baseUrl: string, path: string): string {
  const normalizedBase = baseUrl.trim().replace(/\/+$/, '').replace(/\/api\/v1$/i, '');
  return `${normalizedBase}${apiPath(path)}`;
}
