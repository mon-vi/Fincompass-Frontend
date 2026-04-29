import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ariaReal } from './ariaReal';

const client = vi.hoisted(() => ({ get: vi.fn(), post: vi.fn() }));

vi.mock('@/services/apiClient', () => ({ default: client }));

describe('ariaReal', () => {
  beforeEach(() => {
    client.get.mockReset();
    client.post.mockReset();
  });

  it('maps backend usage fields', async () => {
    client.get.mockResolvedValue({ data: { data: { month: '2026-04-01', messages_used: 3, messages_limit: 50, messages_remaining: 47 } } });

    const usage = await ariaReal.getUsage();

    expect(usage).toEqual({ used: 3, limit: 50, resetsAt: '2026-04-01' });
  });

  it('sends backend message payload and maps returned messages', async () => {
    client.post.mockResolvedValue({
      data: {
        data: {
          user_message: { id: 'u1', role: 'user', content: 'Hi', created_at: '2026-04-29T00:00:00Z' },
          assistant_message: { id: 'a1', role: 'assistant', content: 'Hello', created_at: '2026-04-29T00:00:01Z' },
          usage: { month: '2026-04-01', messages_used: 4, messages_limit: 50 },
        },
      },
    });

    const result = await ariaReal.sendMessage({ conversationId: 'c1', content: 'Hi' });

    expect(client.post).toHaveBeenCalledWith('/api/v1/aria/conversations/c1/messages', { message: 'Hi' });
    expect(result.messages.map((message) => message.content)).toEqual(['Hi', 'Hello']);
  });
});
