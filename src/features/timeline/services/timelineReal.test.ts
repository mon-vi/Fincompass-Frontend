import { beforeEach, describe, expect, it, vi } from 'vitest';
import { timelineReal } from './timelineReal';

const api = vi.hoisted(() => ({ get: vi.fn() }));

vi.mock('@/services/apiClient', () => ({ get: api.get }));

describe('timelineReal', () => {
  beforeEach(() => api.get.mockReset());

  it('maps null payoff dates safely', async () => {
    api.get.mockResolvedValue({
      data: [{ id: 1, debt_entry_id: 5, projected_payoff_date: null, total_interest_paid: 0, timeline_data: [] }],
      meta: { combined_debt_free_date: null, total_interest_optimized: 0 },
    });

    const timeline = await timelineReal.get('minimum');

    expect(timeline.payoffDate).toBeNull();
    expect(timeline.debts[0].payoffDate).toBeNull();
  });
});
