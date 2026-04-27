import { ENV } from '@/constants/env';
import { guidanceMock } from './guidanceMock';
import { guidanceReal } from './guidanceReal';
import type { GuidanceApiAdapter } from './guidanceApi';

export const guidanceAdapter: GuidanceApiAdapter = ENV.USE_MOCK_API ? guidanceMock : guidanceReal;

export type { GuidanceApiAdapter, GuidanceItem, GuidanceType } from './guidanceApi';
