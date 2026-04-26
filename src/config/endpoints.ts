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
    UPLOAD: '/ocr/upload',
    SESSION: (id: string) => `/ocr/sessions/${id}`,
    CONFIRM: (id: string) => `/ocr/sessions/${id}/confirm`,
  },
  ARIA: {
    MESSAGES: '/aria/messages',
    HISTORY: '/aria/history',
    USAGE: '/aria/usage',
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
