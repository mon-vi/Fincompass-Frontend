export type HealthGrade = 'A' | 'B' | 'C' | 'D' | 'F';
export type HealthTrend = 'improving' | 'stable' | 'declining';

export interface ScoreFactor {
  score: number;
  label: string;
  value: string;
  weight: number;
}

export interface HealthScore {
  score: number;
  grade: HealthGrade;
  trend: HealthTrend;
  breakdown: {
    debtToIncome: ScoreFactor;
    savingsRate: ScoreFactor;
    paymentHistory: ScoreFactor;
    budgetAdherence: ScoreFactor;
  };
  lastUpdated: string;
  history: Array<{ month: string; score: number }>;
}

export interface HealthScoreApiAdapter {
  /** GET /api/v1/health-score */
  get(): Promise<HealthScore>;
}
