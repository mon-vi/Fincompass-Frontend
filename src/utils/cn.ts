/**
 * Lightweight class name merger.
 * Joins truthy strings and filters falsy values.
 * Use this instead of a full clsx/twMerge dependency for now —
 * upgrade to clsx + tailwind-merge in Phase 2 if conflicts arise.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
