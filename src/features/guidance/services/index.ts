import { ENV } from '@/constants/env';
import { guidanceMock } from './guidanceMock';
import type { GuidanceApiAdapter } from './guidanceApi';

export const guidanceAdapter: GuidanceApiAdapter = ENV.USE_MOCK_API ? guidanceMock : guidanceMock;

export type { GuidanceApiAdapter, GuidanceItem, GuidanceType } from './guidanceApi';
