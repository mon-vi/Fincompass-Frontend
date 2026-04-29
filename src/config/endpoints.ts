/**
 * All Laravel API endpoint paths, centralised so string literals
 * never appear scattered across adapter files.
 *
 * Prepend ENV.API_BASE_URL to produce full URLs — apiClient already
 * does this via its baseURL config.
 */
export const API = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    ME: '/auth/me',
  },
  ONBOARDING: {
    STATUS: '/onboarding',
    ADVANCE: '/onboarding/advance',
  },
  DASHBOARD: '/dashboard',
  BUDGET: '/budget',
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
  },
  TIMELINE: '/timeline',
  ACTION_PLAN: {
    LIST: '/action-plan',
    DETAIL: (id: string) => `/action-plan/${id}`,
  },
  GUIDANCE: {
    LIST: '/guidance',
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
  return `/api/v1${path}`;
}
