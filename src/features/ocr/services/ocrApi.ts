import type { ExpenseCategory } from '@/features/expenses/services/expensesApi';

export type OcrSessionStatus = 'uploading' | 'processing' | 'ready' | 'confirmed' | 'failed';

export interface OcrExtractedExpense {
  id: string;
  amount: number;
  description: string;
  date: string;
  suggestedCategory: ExpenseCategory;
  confidence: number;
}

export interface OcrSession {
  id: string;
  status: OcrSessionStatus;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  processedAt: string | null;
  extractedExpenses: OcrExtractedExpense[];
  errorMessage: string | null;
}

export interface ConfirmOcrPayload {
  /** IDs of extracted expenses the user chose to import */
  selectedIds: string[];
}

export interface ConfirmOcrResult {
  imported: number;
}

export interface OcrApiAdapter {
  /** POST /api/v1/ocr/upload — multipart/form-data */
  upload(file: File): Promise<{ sessionId: string }>;
  /** GET /api/v1/ocr/sessions/{id} */
  getSession(sessionId: string): Promise<OcrSession>;
  /** POST /api/v1/ocr/sessions/{id}/confirm */
  confirmSession(sessionId: string, payload: ConfirmOcrPayload): Promise<ConfirmOcrResult>;
}
