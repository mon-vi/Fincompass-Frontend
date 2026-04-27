import { ENV } from '@/constants/env';
import { actionPlanMock } from './actionPlanMock';
import { actionPlanReal } from './actionPlanReal';
import type { ActionPlanApiAdapter } from './actionPlanApi';

export const actionPlanAdapter: ActionPlanApiAdapter = ENV.USE_MOCK_API ? actionPlanMock : actionPlanReal;

export type { ActionPlanApiAdapter, ActionItem, ActionCategory, ActionPriority, UpdateActionItemPayload } from './actionPlanApi';
