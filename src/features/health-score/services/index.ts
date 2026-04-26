import { ENV } from '@/constants/env';
import { healthScoreMock } from './healthScoreMock';
import type { HealthScoreApiAdapter } from './healthScoreApi';

export const healthScoreAdapter: HealthScoreApiAdapter = ENV.USE_MOCK_API ? healthScoreMock : healthScoreMock;

export type { HealthScoreApiAdapter, HealthScore, HealthGrade, HealthTrend, ScoreFactor } from './healthScoreApi';
