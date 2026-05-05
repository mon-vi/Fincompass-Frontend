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
});
