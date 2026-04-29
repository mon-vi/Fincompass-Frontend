import { actionPlanReal } from './actionPlanReal';
import type { ActionPlanApiAdapter } from './actionPlanApi';

export const actionPlanAdapter: ActionPlanApiAdapter = actionPlanReal;

export type { ActionPlanApiAdapter, ActionItem, ActionCategory, ActionPriority, UpdateActionItemPayload } from './actionPlanApi';
