import { ocrReal } from './ocrReal';
import type { OcrApiAdapter } from './ocrApi';

export const ocrAdapter: OcrApiAdapter = ocrReal;

export type {
  OcrApiAdapter,
  OcrSession,
  OcrSessionStatus,
  OcrExtractedExpense,
  OcrExtractedDebt,
  OcrExtractedItem,
  OcrConfirmItem,
  ConfirmOcrPayload,
  ConfirmOcrResult,
} from './ocrApi';
