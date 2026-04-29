import { describe, expect, it } from 'vitest';
import { safeFormatDate } from './formatters';

describe('safeFormatDate', () => {
  it('returns fallback for missing or invalid dates', () => {
    expect(safeFormatDate(null)).toBe('—');
    expect(safeFormatDate(undefined)).toBe('—');
    expect(safeFormatDate('')).toBe('—');
    expect(safeFormatDate('invalid')).toBe('—');
  });

  it('formats valid dates', () => {
    expect(safeFormatDate('2026-05-01T00:00:00Z', { year: 'numeric', month: 'short' })).toBe('May 2026');
  });
});
