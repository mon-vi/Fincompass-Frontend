import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EmailParserPage } from './EmailParserPage';

const mocks = vi.hoisted(() => ({
  apply: vi.fn(),
  dismiss: vi.fn(),
}));

vi.mock('@/features/email-parser/hooks', () => ({
  useEmailParserForwardingAddress: () => ({ isLoading: false, isError: false, data: { address: 'inbox@parse.fincompass.app' } }),
  useEmailParserEvents: () => ({
    isLoading: false,
    isError: false,
    data: [{
      id: 'evt-1',
      status: 'matched',
      subject: 'Receipt from Store',
      sender: 'receipts@example.com',
      receivedAt: '2026-04-29T12:00:00.000Z',
      matchedType: 'expense',
      matchedId: 'expense-1',
      parsedData: { amount: 42.5, description: 'Store' },
      errorMessage: null,
    }],
  }),
  useApplyEmailParserEvent: () => ({ mutate: mocks.apply, isPending: false, error: null }),
  useDismissEmailParserEvent: () => ({ mutate: mocks.dismiss, isPending: false, error: null }),
}));

describe('EmailParserPage', () => {
  it('lists parsed events and triggers actions', async () => {
    render(<EmailParserPage />);

    expect(screen.getByText('inbox@parse.fincompass.app')).toBeInTheDocument();
    expect(screen.getByText('Receipt from Store')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Apply' }));
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }));

    expect(mocks.apply).toHaveBeenCalledWith({ id: 'evt-1' }, expect.any(Object));
    expect(mocks.dismiss).toHaveBeenCalledWith('evt-1', expect.any(Object));
  });
});
