import { ENV } from '@/constants/env';
import { ocrMock } from './ocrMock';
import { ocrReal } from './ocrReal';
import type { OcrApiAdapter } from './ocrApi';

export const ocrAdapter: OcrApiAdapter = ENV.USE_MOCK_API ? ocrMock : ocrReal;

export type {
  OcrApiAdapter,
  OcrSession,
  OcrSessionStatus,
  OcrExtractedExpense,
  ConfirmOcrPayload,
  ConfirmOcrResult,
} from './ocrApi';
