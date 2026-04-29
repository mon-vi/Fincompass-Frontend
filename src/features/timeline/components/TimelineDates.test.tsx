import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DebtTimelineList } from './DebtTimelineList';
import { PayoffSummary } from './PayoffSummary';
import type { Timeline } from '../services';

describe('timeline date rendering', () => {
  it('does not crash when payoff dates are null', () => {
    const timeline: Timeline = {
      strategy: 'minimum',
      totalInterestPaid: 0,
      totalPaid: 0,
      payoffDate: null,
      totalMonths: 0,
      extraPayment: 0,
      debts: [{ debtId: 'debt-1', debtName: 'Visa', payoffDate: null, payoffMonth: 0, totalPaid: 0, interestPaid: 0 }],
      monthlySnapshots: [],
    };

    render(
      <>
        <PayoffSummary timeline={timeline} />
        <DebtTimelineList debts={timeline.debts} />
      </>,
    );

    expect(screen.getByText('Debt-free date')).toBeInTheDocument();
    expect(screen.getByText('Paid off —')).toBeInTheDocument();
  });
});
