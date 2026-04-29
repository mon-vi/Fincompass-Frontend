import { beforeEach, describe, expect, it, vi } from 'vitest';
import { emailParserReal } from './emailParserReal';

const api = vi.hoisted(() => ({ get: vi.fn(), patch: vi.fn() }));

vi.mock('@/services/apiClient', () => ({ get: api.get, patch: api.patch }));

describe('emailParserReal', () => {
  beforeEach(() => {
    api.get.mockReset();
    api.patch.mockReset();
  });

  it('handles null forwarding address', async () => {
    api.get.mockResolvedValue({ data: null });

    await expect(emailParserReal.getForwardingAddress()).resolves.toBeNull();
  });

  it('does not depend on apply response shape', async () => {
    api.patch.mockResolvedValue({ data: { id: 'debt-1', name: 'Imported Debt' } });

    await expect(emailParserReal.applyEvent('event-1')).resolves.toBeUndefined();
    expect(api.patch).toHaveBeenCalledWith('/api/v1/email-parser/events/event-1/apply', { target_id: undefined, target_type: undefined });
  });
});
