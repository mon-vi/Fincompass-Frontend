import { guidanceReal } from './guidanceReal';
import type { GuidanceApiAdapter } from './guidanceApi';

export const guidanceAdapter: GuidanceApiAdapter = guidanceReal;

export type { GuidanceApiAdapter, GuidanceItem, GuidanceType } from './guidanceApi';
