/**
 * Typed, validated access to VITE_ environment variables.
 * All values are read once at module load time.
 */
export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL as string,
  API_TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT ?? 10000),
  APP_NAME: (import.meta.env.VITE_APP_NAME as string) ?? 'FinCompass',
  APP_ENV: (import.meta.env.VITE_APP_ENV as string) ?? 'development',

  FEATURES: {
    OCR: import.meta.env.VITE_FEATURE_OCR === 'true',
    EMAIL_PARSING: import.meta.env.VITE_FEATURE_EMAIL_PARSING === 'true',
    ARIA_CHAT: import.meta.env.VITE_FEATURE_ARIA_CHAT === 'true',
  },

  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
} as const;
