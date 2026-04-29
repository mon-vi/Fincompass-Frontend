import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AriaPage } from './AriaPage';

const mocks = vi.hoisted(() => ({
  submit: vi.fn(),
  setInput: vi.fn(),
  usage: { used: 50, limit: 50, resetsAt: '2026-05-01T00:00:00.000Z' as string | null | undefined },
}));

vi.mock('@/features/aria/hooks', () => ({
  useAriaActiveConversation: () => ({
    messages: [{ id: 'm1', role: 'assistant', content: 'Safe guidance response', createdAt: new Date().toISOString() }],
    isLoading: false,
    isError: false,
    error: null,
  }),
  useAriaUsage: () => ({ data: mocks.usage, isError: false }),
  useAriaInput: () => ({ input: 'Can I pay debt faster?', setInput: mocks.setInput, submit: mocks.submit, isPending: false, isError: false, error: null }),
}));

describe('AriaPage', () => {
  beforeEach(() => {
    mocks.usage = { used: 50, limit: 50, resetsAt: '2026-05-01T00:00:00.000Z' };
  });

  it('renders assistant messages and blocks input at the usage limit', async () => {
    render(<AriaPage />);

    expect(screen.getByText('Safe guidance response')).toBeInTheDocument();
    expect(screen.getByText(/monthly message limit/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Message limit reached')).toBeDisabled();

    await userEvent.click(screen.getByRole('button', { name: 'Send' }));
    expect(mocks.submit).not.toHaveBeenCalled();
  });

  it('does not crash when usage reset date is missing', () => {
    mocks.usage = { used: 50, limit: 50, resetsAt: undefined };

    render(<AriaPage />);

    expect(screen.getByText(/monthly message limit/i)).toBeInTheDocument();
    expect(screen.getByText(/Limit reached\. Resets/)).toBeInTheDocument();
  });
});
