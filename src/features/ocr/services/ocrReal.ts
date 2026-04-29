import apiClient from '@/services/apiClient';
import { get, patch } from '@/services/apiClient';
import { handleApiError } from '@/services/apiError';
import { apiPath, API } from '@/config/endpoints';
import type { LaravelResource } from '@/services/apiError';
import type { ExpenseCategory } from '@/features/expenses/services';
import type { OcrApiAdapter, OcrSession, OcrExtractedDebt, OcrExtractedExpense, OcrExtractedItem, ConfirmOcrPayload, ConfirmOcrResult } from './ocrApi';

type LaravelOcrStatus = OcrSession['status'];

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
  original_filename?: string;
  size_bytes?: number;
  created_at?: string;
  processed_at?: string | null;
  extracted_fields?: Record<string, unknown> | null;
  confidence_score?: number | string | null;
  error_message?: string | null;
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
    date: item.date ?? null,
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
  const fields = session.extracted_fields ?? {};
  const fallbackType = fields.kind === 'expense' ? 'expense' : 'debt';
  const extractedItems = Object.keys(fields).length > 0
    ? [mapItem({
      id: session.id,
      type: fallbackType,
      amount: fields.amount as number | string | undefined,
      balance: fields.current_balance as number | string | undefined,
      description: typeof fields.name === 'string' ? fields.name : undefined,
      name: typeof fields.name === 'string' ? fields.name : undefined,
      category: fields.category as ExpenseCategory | undefined,
      debt_type: typeof fields.type === 'string' ? fields.type : null,
      interest_rate: fields.interest_rate as number | string | null,
      minimum_payment: fields.minimum_payment as number | string | null,
      due_date: null,
      confidence: session.confidence_score,
    }, fallbackType)]
    : [];

  return {
    id: session.id,
    status: session.status,
    fileName: session.original_filename ?? 'Uploaded document',
    fileSize: session.size_bytes ?? 0,
    uploadedAt: session.created_at ?? '',
    processedAt: session.processed_at ?? null,
    extractedItems,
    errorMessage: session.error_message ?? null,
  };
}

function toConfirmPayload(payload: ConfirmOcrPayload) {
  const item = payload.items[0];
  if (!item) return { fields: {} };
  if (item.type === 'expense') {
    return {
      fields: {
        kind: 'expense',
        name: item.description,
        category: item.suggestedCategory,
        amount: item.amount,
      },
    };
  }
  return {
    fields: {
      kind: 'debt',
      name: item.description,
      type: item.debtType ?? 'other',
      current_balance: item.amount,
      interest_rate: item.interestRate ?? 0,
      minimum_payment: item.minimumPayment ?? 0,
    },
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
      const res = await patch<LaravelResource<{ id?: string }> | { id?: string }>(
        apiPath(API.OCR.CONFIRM(sessionId)),
        toConfirmPayload(payload),
      );
      const created = 'data' in res ? res.data : res;
      return { createdId: created.id ?? null };
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
