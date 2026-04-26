import type { Timeline, PayoffStrategy, TimelineApiAdapter } from './timelineApi';

const delay = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

const TIMELINES: Record<PayoffStrategy, Omit<Timeline, 'extraPayment'>> = {
  minimum: {
    strategy: 'minimum',
    totalInterestPaid: 12840,
    totalPaid: 56340,
    payoffDate: '2030-08-01',
    totalMonths: 52,
    debts: [
      { debtId: 'debt-3', debtName: 'Federal Student Loan', payoffDate: '2028-10-01', payoffMonth: 30, totalPaid: 26250, interestPaid: 3250 },
      { debtId: 'debt-2', debtName: 'Toyota Auto Loan', payoffDate: '2029-04-01', payoffMonth: 36, totalPaid: 14520, interestPaid: 2520 },
      { debtId: 'debt-1', debtName: 'Chase Freedom Visa', payoffDate: '2030-08-01', payoffMonth: 52, totalPaid: 15570, interestPaid: 7070 },
    ],
    monthlySnapshots: Array.from({ length: 52 }, (_, i) => ({
      month: i + 1,
      date: new Date(2026, 4 + i, 1).toISOString().slice(0, 10),
      totalBalance: Math.max(0, 43500 - (43500 / 52) * (i + 1)),
      totalPayment: 700,
      totalInterest: 246,
    })),
  },
  avalanche: {
    strategy: 'avalanche',
    totalInterestPaid: 8190,
    totalPaid: 51690,
    payoffDate: '2029-04-01',
    totalMonths: 36,
    debts: [
      { debtId: 'debt-1', debtName: 'Chase Freedom Visa', payoffDate: '2027-10-01', payoffMonth: 18, totalPaid: 10820, interestPaid: 2320 },
      { debtId: 'debt-2', debtName: 'Toyota Auto Loan', payoffDate: '2028-08-01', payoffMonth: 28, totalPaid: 14100, interestPaid: 2100 },
      { debtId: 'debt-3', debtName: 'Federal Student Loan', payoffDate: '2029-04-01', payoffMonth: 36, totalPaid: 26770, interestPaid: 3770 },
    ],
    monthlySnapshots: Array.from({ length: 36 }, (_, i) => ({
      month: i + 1,
      date: new Date(2026, 4 + i, 1).toISOString().slice(0, 10),
      totalBalance: Math.max(0, 43500 - (43500 / 36) * (i + 1)),
      totalPayment: 700,
      totalInterest: 228,
    })),
  },
  snowball: {
    strategy: 'snowball',
    totalInterestPaid: 9340,
    totalPaid: 52840,
    payoffDate: '2029-08-01',
    totalMonths: 40,
    debts: [
      { debtId: 'debt-1', debtName: 'Chase Freedom Visa', payoffDate: '2027-08-01', payoffMonth: 16, totalPaid: 11200, interestPaid: 2700 },
      { debtId: 'debt-2', debtName: 'Toyota Auto Loan', payoffDate: '2028-10-01', payoffMonth: 30, totalPaid: 14870, interestPaid: 2870 },
      { debtId: 'debt-3', debtName: 'Federal Student Loan', payoffDate: '2029-08-01', payoffMonth: 40, totalPaid: 26770, interestPaid: 3770 },
    ],
    monthlySnapshots: Array.from({ length: 40 }, (_, i) => ({
      month: i + 1,
      date: new Date(2026, 4 + i, 1).toISOString().slice(0, 10),
      totalBalance: Math.max(0, 43500 - (43500 / 40) * (i + 1)),
      totalPayment: 700,
      totalInterest: 234,
    })),
  },
};

export const timelineMock: TimelineApiAdapter = {
  async get(strategy: PayoffStrategy, extraPayment = 0): Promise<Timeline> {
    await delay(600);
    const base = TIMELINES[strategy];
    if (extraPayment > 0) {
      const reduction = Math.floor(extraPayment / 100);
      return {
        ...base,
        extraPayment,
        totalMonths: Math.max(1, base.totalMonths - reduction),
        totalInterestPaid: Math.max(0, base.totalInterestPaid - extraPayment * 2),
      };
    }
    return { ...base, extraPayment: 0 };
  },
};
