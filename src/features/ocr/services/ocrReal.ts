import apiClient from '@/services/apiClient';
import { get, patch } from '@/services/apiClient';
import { handleApiError } from '@/services/apiError';
import { apiPath, API } from '@/config/endpoints';
import type { LaravelResource } from '@/services/apiError';
import type { ExpenseCategory } from '@/features/expenses/services';
import type { OcrApiAdapter, OcrSession, OcrExtractedDebt, OcrExtractedExpense, OcrExtractedItem, ConfirmOcrPayload, ConfirmOcrResult } from './ocrApi';

type LaravelOcrStatus = OcrSession['status'] | 'ready';

interface LaravelOcrExtractedItem {
  id: string;
  type?: 'expense' | 'debt';
  amount?: number | string;
  balance?: number | string;
  description?: string;
  name?: string;
  date?: string | null;
  suggested_category?: ExpenseCategory | null;
  category?: ExpenseCategory | null;
  debt_type?: string | null;
  interest_rate?: number | string | null;
  minimum_payment?: number | string | null;
  due_date?: string | null;
  confidence?: number | string | null;
}

interface LaravelOcrSession {
  id: string;
  status: LaravelOcrStatus;
  file_name?: string;
  fileName?: string;
  file_size?: number;
  fileSize?: number;
  uploaded_at?: string;
  uploadedAt?: string;
  processed_at?: string | null;
  processedAt?: string | null;
  extracted_items?: LaravelOcrExtractedItem[];
  extracted_expenses?: LaravelOcrExtractedItem[];
  extracted_debts?: LaravelOcrExtractedItem[];
  error_message?: string | null;
  errorMessage?: string | null;
}

function numberValue(value: unknown, fallback = 0): number {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function confidenceValue(value: unknown): number {
  const numeric = numberValue(value, 0);
  return numeric > 1 ? numeric / 100 : numeric;
}

function mapExpense(item: LaravelOcrExtractedItem): OcrExtractedExpense {
  return {
    id: item.id,
    type: 'expense',
    amount: numberValue(item.amount),
    description: item.description ?? item.name ?? 'Extracted expense',
    date: item.date ?? new Date().toISOString().slice(0, 10),
    suggestedCategory: item.suggested_category ?? item.category ?? 'other',
    confidence: confidenceValue(item.confidence),
  };
}

function mapDebt(item: LaravelOcrExtractedItem): OcrExtractedDebt {
  return {
    id: item.id,
    type: 'debt',
    amount: numberValue(item.balance ?? item.amount),
    description: item.description ?? item.name ?? 'Extracted debt',
    debtType: item.debt_type ?? null,
    interestRate: item.interest_rate == null ? null : numberValue(item.interest_rate),
    minimumPayment: item.minimum_payment == null ? null : numberValue(item.minimum_payment),
    dueDate: item.due_date ?? null,
    confidence: confidenceValue(item.confidence),
  };
}

function mapItem(item: LaravelOcrExtractedItem, fallbackType: 'expense' | 'debt'): OcrExtractedItem {
  return (item.type ?? fallbackType) === 'debt' ? mapDebt(item) : mapExpense(item);
}

function mapSession(session: LaravelOcrSession): OcrSession {
  const extractedExpenses = (session.extracted_expenses ?? [])
    .map((item) => mapItem(item, 'expense'))
    .filter((item): item is OcrExtractedExpense => item.type === 'expense');
  const extractedDebts = (session.extracted_debts ?? [])
    .map((item) => mapItem(item, 'debt'))
    .filter((item): item is OcrExtractedDebt => item.type === 'debt');
  const extractedItems = session.extracted_items
    ? session.extracted_items.map((item) => mapItem(item, item.type ?? 'expense'))
    : [...extractedExpenses, ...extractedDebts];

  return {
    id: session.id,
    status: session.status === 'ready' ? 'review_ready' : session.status,
    fileName: session.file_name ?? session.fileName ?? 'Uploaded document',
    fileSize: session.file_size ?? session.fileSize ?? 0,
    uploadedAt: session.uploaded_at ?? session.uploadedAt ?? '',
    processedAt: session.processed_at ?? session.processedAt ?? null,
    extractedExpenses: extractedItems.filter((item): item is OcrExtractedExpense => item.type === 'expense'),
    extractedDebts: extractedItems.filter((item): item is OcrExtractedDebt => item.type === 'debt'),
    extractedItems,
    errorMessage: session.error_message ?? session.errorMessage ?? null,
  };
}

function toConfirmPayload(payload: ConfirmOcrPayload) {
  return {
    selected_items: payload.items.map((item) => ({
      id: item.id,
      type: item.type,
      amount: item.amount,
      description: item.description,
      date: item.type === 'expense' ? item.date : undefined,
      suggested_category: item.type === 'expense' ? item.suggestedCategory : undefined,
      debt_type: item.type === 'debt' ? item.debtType : undefined,
      interest_rate: item.type === 'debt' ? item.interestRate : undefined,
      minimum_payment: item.type === 'debt' ? item.minimumPayment : undefined,
      due_date: item.type === 'debt' ? item.dueDate : undefined,
    })),
  };
}

export const ocrReal: OcrApiAdapter = {
  async upload(file: File, onProgress?: (progress: number) => void): Promise<{ sessionId: string }> {
    try {
      const form = new FormData();
      form.append('file', file);
      const response = await apiClient.post<{ data?: { id?: string; session_id?: string; upload_id?: string }; id?: string; session_id?: string; upload_id?: string }>(
        apiPath(API.OCR.UPLOADS),
        form,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (event) => {
            if (!event.total || !onProgress) return;
            onProgress(Math.round((event.loaded / event.total) * 100));
          },
        },
      );
      const body = response.data.data ?? response.data;
      const sessionId = body.id ?? body.upload_id ?? body.session_id;
      if (!sessionId) throw new Error('Upload succeeded but no upload id was returned.');
      return { sessionId };
    } catch (err) {
      handleApiError(err);
    }
  },

  async getSession(sessionId: string): Promise<OcrSession> {
    try {
      const res = await get<LaravelResource<LaravelOcrSession> | LaravelOcrSession>(apiPath(API.OCR.DETAIL(sessionId)));
      return mapSession('data' in res ? res.data : res);
    } catch (err) {
      handleApiError(err);
    }
  },

  async confirmSession(sessionId: string, payload: ConfirmOcrPayload): Promise<ConfirmOcrResult> {
    try {
      const res = await patch<LaravelResource<ConfirmOcrResult> | ConfirmOcrResult>(
        apiPath(API.OCR.CONFIRM(sessionId)),
        toConfirmPayload(payload),
      );
      return 'data' in res ? res.data : res;
    } catch (err) {
      handleApiError(err);
    }
  },

  async abandonSession(sessionId: string): Promise<void> {
    try {
      await patch<void>(apiPath(API.OCR.ABANDON(sessionId)));
    } catch (err) {
      handleApiError(err);
    }
  },
};
