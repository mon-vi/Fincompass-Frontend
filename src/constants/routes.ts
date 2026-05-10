/**
 * Application route path constants.
 * Centralised here so route strings are never hardcoded across the app.
 */
export const ROUTES = {
  // Public
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  // Onboarding (authenticated but incomplete profile)
  ONBOARDING: '/onboarding',

  // Protected — main app
  DASHBOARD: '/dashboard',
  INCOME: '/income',
  BUDGET: '/budget',
  DEBTS: '/debts',
  EXPENSES: '/expenses',
  HEALTH_SCORE: '/health-score',
  TIMELINE: '/timeline',
  ACTION_PLAN: '/action-plan',

  // OCR
  OCR_UPLOAD: '/expenses/ocr',
  OCR_REVIEW: '/expenses/ocr/review/:id',
  EMAIL_PARSER: '/email-parser',

  // CFO tier
  ARIA: '/aria',
  DOCUMENTS: '/documents',

  // Account
  SETTINGS: '/settings',
  PROFILE: '/profile',
  BILLING: '/billing',
  NOTIFICATIONS: '/notifications',

  // Misc
  NOT_FOUND: '*',
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
