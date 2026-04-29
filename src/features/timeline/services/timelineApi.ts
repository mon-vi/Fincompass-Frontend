export type PayoffStrategy = 'minimum' | 'avalanche' | 'snowball';

export interface DebtTimelineItem {
  debtId: string;
  debtName: string;
  payoffDate: string | null;
  payoffMonth: number;
  totalPaid: number;
  interestPaid: number;
}

export interface MonthlySnapshot {
  month: number;
  date: string | null;
  totalBalance: number;
  totalPayment: number;
  totalInterest: number;
}

export interface Timeline {
  strategy: PayoffStrategy;
  totalInterestPaid: number;
  totalPaid: number;
  payoffDate: string | null;
  totalMonths: number;
  extraPayment: number;
  debts: DebtTimelineItem[];
  monthlySnapshots: MonthlySnapshot[];
}

export interface TimelineApiAdapter {
  /** GET /api/v1/timeline?strategy= */
  get(strategy: PayoffStrategy, extraPayment?: number): Promise<Timeline>;
}
