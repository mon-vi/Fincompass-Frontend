import { beforeEach, describe, expect, it, vi } from 'vitest';
import { onboardingReal } from './onboardingReal';

const api = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
}));

vi.mock('@/services/apiClient', () => ({
  get: api.get,
  post: api.post,
}));

describe('onboardingReal', () => {
  beforeEach(() => {
    api.get.mockReset();
    api.post.mockReset();
  });

  it('advances financial goals through the supported onboarding advance endpoint', async () => {
    api.post.mockResolvedValue({ data: { onboarding_step: 2, is_onboarding_complete: false } });

    const result = await onboardingReal.advance({ step: 1, data: { goals: ['pay_off_debt'] } });

    expect(api.post).toHaveBeenCalledWith('/api/v1/onboarding/advance', {
      step: 1,
      data: { goals: ['pay_off_debt'] },
    });
    expect(api.post).not.toHaveBeenCalledWith(expect.stringContaining('/goals'), expect.anything());
    expect(result).toEqual({ nextStep: 2, onboardingStatus: 'pending' });
  });

  it('detects completion via is_onboarding_complete: true', async () => {
    api.post.mockResolvedValue({ data: { onboarding_step: 4, is_onboarding_complete: true } });

    const result = await onboardingReal.advance({ step: 4, data: { housing: 1200, transportation: 400, food: 600, utilities: 0, other: 0 } });

    expect(result).toEqual({ nextStep: null, onboardingStatus: 'complete' });
  });

  it('detects completion via next_step: null (alternate backend signal)', async () => {
    api.post.mockResolvedValue({ data: { next_step: null, onboarding_status: 'pending' } });

    const result = await onboardingReal.advance({ step: 4, data: { housing: 0, transportation: 0, food: 0, utilities: 0, other: 0 } });

    expect(result).toEqual({ nextStep: null, onboardingStatus: 'complete' });
  });

  it('detects completion via onboarding_status: "complete" field', async () => {
    api.post.mockResolvedValue({ data: { onboarding_status: 'complete' } });

    const result = await onboardingReal.advance({ step: 4, data: { housing: 0, transportation: 0, food: 0, utilities: 0, other: 0 } });

    expect(result).toEqual({ nextStep: null, onboardingStatus: 'complete' });
  });

  it('detects completion when onboarding_step exceeds 4', async () => {
    api.post.mockResolvedValue({ data: { onboarding_step: 5 } });

    const result = await onboardingReal.advance({ step: 4, data: { housing: 0, transportation: 0, food: 0, utilities: 0, other: 0 } });

    expect(result).toEqual({ nextStep: null, onboardingStatus: 'complete' });
  });

  it('resolves next_step from explicit next_step field when pending', async () => {
    api.post.mockResolvedValue({ data: { next_step: 3, is_onboarding_complete: false } });

    const result = await onboardingReal.advance({ step: 2, data: { monthlyIncome: 3000, incomeType: 'salary' } });

    expect(result).toEqual({ nextStep: 3, onboardingStatus: 'pending' });
  });

  it('handles non-wrapped response (no data envelope) gracefully', async () => {
    api.post.mockResolvedValue({ onboarding_step: 3, is_onboarding_complete: false });

    const result = await onboardingReal.advance({ step: 2, data: { monthlyIncome: 3000, incomeType: 'salary' } });

    expect(result.onboardingStatus).toBe('pending');
  });
});
