import { ENV } from '@/constants/env';
import { timelineMock } from './timelineMock';
import type { TimelineApiAdapter } from './timelineApi';

export const timelineAdapter: TimelineApiAdapter = ENV.USE_MOCK_API ? timelineMock : timelineMock;

export type { TimelineApiAdapter, Timeline, PayoffStrategy, DebtTimelineItem, MonthlySnapshot } from './timelineApi';
