import { ENV } from '@/constants/env';
import { timelineMock } from './timelineMock';
import { timelineReal } from './timelineReal';
import type { TimelineApiAdapter } from './timelineApi';

export const timelineAdapter: TimelineApiAdapter = ENV.USE_MOCK_API ? timelineMock : timelineReal;

export type { TimelineApiAdapter, Timeline, PayoffStrategy, DebtTimelineItem, MonthlySnapshot } from './timelineApi';
