import type { ExpenseCategory } from '@/features/expenses/services/expensesApi';

export type OcrSessionStatus = 'uploaded' | 'pending' | 'uploading' | 'processing' | 'review_ready' | 'confirmed' | 'failed' | 'abandoned';

export type OcrExtractedItemType = 'expense' | 'debt';

export interface OcrExtractedExpense {
  id: string;
  type: 'expense';
  amount: number;
  description: string;
  date: string | null;
  suggestedCategory: ExpenseCategory;
  confidence: number;
}

export interface OcrExtractedDebt {
  id: string;
  type: 'debt';
  amount: number;
  description: string;
  debtType: string | null;
  interestRate: number | null;
  minimumPayment: number | null;
  dueDate: string | null;
  confidence: number;
}

export type OcrExtractedItem = OcrExtractedExpense | OcrExtractedDebt;

export interface OcrSession {
  id: string;
  status: OcrSessionStatus;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  processedAt: string | null;
  extractedItems: OcrExtractedItem[];
  errorMessage: string | null;
}

export type OcrConfirmItem = OcrExtractedItem;

export interface ConfirmOcrPayload {
  /** Edited extracted items the user chose to import. */
  items: OcrConfirmItem[];
}

export interface ConfirmOcrResult {
  createdId: string | null;
}

export interface OcrApiAdapter {
  /** POST /api/v1/ocr/uploads — multipart/form-data */
  upload(file: File, onProgress?: (progress: number) => void): Promise<{ sessionId: string }>;
  /** GET /api/v1/ocr/uploads/{id} */
  getSession(sessionId: string): Promise<OcrSession>;
  /** PATCH /api/v1/ocr/uploads/{id}/confirm */
  confirmSession(sessionId: string, payload: ConfirmOcrPayload): Promise<ConfirmOcrResult>;
  /** PATCH /api/v1/ocr/uploads/{id}/abandon */
  abandonSession(sessionId: string): Promise<void>;
}
