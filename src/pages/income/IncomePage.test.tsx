import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { IncomePage } from './IncomePage';

const mocks = vi.hoisted(() => ({
  incomeList: [] as object[],
  isLoading: false,
  isError: false,
  error: null as Error | null,
  create: vi.fn(),
  update: vi.fn(),
}));

vi.mock('@/features/income/hooks', () => ({
  useIncome: () => ({
    data: mocks.incomeList,
    isLoading: mocks.isLoading,
    isError: mocks.isError,
    error: mocks.error,
  }),
  useCreateIncome: () => ({ mutate: mocks.create, isPending: false, error: null }),
  useUpdateIncome: () => ({ mutate: mocks.update, isPending: false, error: null }),
  useDeleteIncome: () => ({ mutate: vi.fn(), isPending: false }),
}));

describe('IncomePage', () => {
  beforeEach(() => {
    mocks.incomeList = [];
    mocks.isLoading = false;
    mocks.isError = false;
    mocks.error = null;
    mocks.create = vi.fn();
    mocks.update = vi.fn();
  });

  it('renders empty state when no income sources exist', () => {
    render(<IncomePage />);

    expect(screen.getByText(/no income sources yet/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add your first income source/i })).toBeInTheDocument();
  });

  it('renders income list when data is present', () => {
    mocks.incomeList = [
      {
        id: '1',
        sourceName: 'Day job',
        type: 'salary',
        amount: 5000,
        frequency: 'monthly',
        monthlyAmount: 5000,
        isActive: true,
      },
    ];
    render(<IncomePage />);

    expect(screen.getByText('Day job')).toBeInTheDocument();
    expect(screen.getAllByText(/\$5,000/).length).toBeGreaterThan(0);
  });

  it('shows the add form when Add income button is clicked', async () => {
    render(<IncomePage />);

    await userEvent.click(screen.getByRole('button', { name: /^add income$/i }));

    expect(screen.getByText(/new income source/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/source name/i)).toBeInTheDocument();
  });

  it('shows loading skeletons while fetching', () => {
    mocks.isLoading = true;
    render(<IncomePage />);

    expect(screen.queryByText(/no income sources/i)).not.toBeInTheDocument();
  });

  it('shows error alert on fetch failure', () => {
    mocks.isError = true;
    mocks.error = new Error('Failed to load income sources');
    render(<IncomePage />);

    expect(screen.getByText(/failed to load income sources/i)).toBeInTheDocument();
  });

  it('shows monthly total', () => {
    mocks.incomeList = [
      { id: '1', sourceName: 'Job', type: 'salary', amount: 4000, frequency: 'monthly', monthlyAmount: 4000, isActive: true },
      { id: '2', sourceName: 'Side gig', type: 'freelance', amount: 1000, frequency: 'monthly', monthlyAmount: 1000, isActive: true },
    ];
    render(<IncomePage />);

    expect(screen.getByText(/\$5,000/)).toBeInTheDocument();
  });
});
