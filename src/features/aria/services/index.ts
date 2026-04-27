import { ENV } from '@/constants/env';
import { ariaMock } from './ariaMock';
import { ariaReal } from './ariaReal';
import type { AriaApiAdapter } from './ariaApi';

export const ariaAdapter: AriaApiAdapter = ENV.USE_MOCK_API ? ariaMock : ariaReal;

export type {
  AriaApiAdapter,
  AriaChatMessage,
  AriaMessageRole,
  AriaUsage,
  SendMessagePayload,
  SendMessageResult,
} from './ariaApi';
