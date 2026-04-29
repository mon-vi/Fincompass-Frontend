import { healthScoreReal } from './healthScoreReal';
import type { HealthScoreApiAdapter } from './healthScoreApi';

export const healthScoreAdapter: HealthScoreApiAdapter = healthScoreReal;

export type { HealthScoreApiAdapter, HealthScore, HealthGrade, HealthTrend, ScoreFactor } from './healthScoreApi';
