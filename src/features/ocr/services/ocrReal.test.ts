import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ocrReal } from './ocrReal';

const api = vi.hoisted(() => ({
  get: vi.fn(),
  patch: vi.fn(),
  clientPost: vi.fn(),
}));

vi.mock('@/services/apiClient', () => ({
  get: api.get,
  patch: api.patch,
  default: { post: api.clientPost },
}));

describe('ocrReal', () => {
  beforeEach(() => {
    api.get.mockReset();
    api.patch.mockReset();
    api.clientPost.mockReset();
  });

  it('maps uploaded and review_ready OCR resources from extracted fields', async () => {
    api.get.mockResolvedValue({
      data: {
        id: '1',
        status: 'review_ready',
        original_filename: 'card.pdf',
        size_bytes: 100,
        created_at: '2026-04-29T00:00:00Z',
        processed_at: '2026-04-29T00:01:00Z',
        confidence_score: 0.9,
        extracted_fields: { kind: 'debt', name: 'Card', type: 'credit_card', current_balance: 1200, interest_rate: 20, minimum_payment: 50 },
      },
    });

    const session = await ocrReal.getSession('1');

    expect(session.status).toBe('review_ready');
    expect(session.extractedItems[0]).toMatchObject({ type: 'debt', description: 'Card', amount: 1200 });
  });

  it('sends backend fields payload on confirm', async () => {
    api.patch.mockResolvedValue({ data: { id: 'debt-1' } });

    await ocrReal.confirmSession('1', {
      items: [{ id: '1', type: 'debt', description: 'Card', amount: 1200, debtType: 'credit_card', interestRate: 20, minimumPayment: 50, dueDate: null, confidence: 0.9 }],
    });

    expect(api.patch).toHaveBeenCalledWith('/api/v1/ocr/uploads/1/confirm', {
      fields: { kind: 'debt', name: 'Card', type: 'credit_card', current_balance: 1200, interest_rate: 20, minimum_payment: 50 },
    });
  });
});
