/**
 * Display formatting utilities.
 */

/** Format a number as USD currency. */
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

export function toValidDate(value: unknown): Date | null {
  if (value == null) return null;
  if (typeof value === 'string' && value.trim() === '') return null;

  const date = value instanceof Date ? value : new Date(value as string | number);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Format a date-like value without throwing on null or invalid backend data. */
export function safeFormatDate(
  value: unknown,
  options?: Intl.DateTimeFormatOptions,
  fallback = '—',
): string {
  const date = toValidDate(value);
  if (!date) return fallback;

  try {
    return new Intl.DateTimeFormat('en-US', options ?? { dateStyle: 'medium' }).format(date);
  } catch {
    return fallback;
  }
}

/** Format an ISO date string to a human-readable date. */
export function formatDate(iso: unknown, options?: Intl.DateTimeFormatOptions): string {
  return safeFormatDate(iso, options);
}

/** Capitalize first letter of a string. */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Truncate a string to a max length with ellipsis. */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength - 3)}...`;
}
