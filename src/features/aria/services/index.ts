import { ariaReal } from './ariaReal';
import type { AriaApiAdapter } from './ariaApi';

export const ariaAdapter: AriaApiAdapter = ariaReal;

export type {
  AriaApiAdapter,
  AriaChatMessage,
  AriaConversation,
  AriaMessageRole,
  AriaUsage,
  SendMessagePayload,
  SendMessageResult,
} from './ariaApi';
