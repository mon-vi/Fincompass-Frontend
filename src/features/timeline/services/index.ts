import { timelineReal } from './timelineReal';
import type { TimelineApiAdapter } from './timelineApi';

export const timelineAdapter: TimelineApiAdapter = timelineReal;

export type { TimelineApiAdapter, Timeline, PayoffStrategy, DebtTimelineItem, MonthlySnapshot } from './timelineApi';
