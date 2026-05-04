import { describe, expect, it } from 'vitest';
import { designTokens } from './designTokens';

describe('design tokens', () => {
  it('exposes shared brand tokens for marketing and app surfaces', () => {
    expect(designTokens.colors.primary).toBe('var(--fc-color-primary)');
    expect(designTokens.classes.logoMark).toContain('var(--fc-color-primary)');
    expect(designTokens.classes.accentButton).toContain('var(--fc-color-accent)');
  });
});
