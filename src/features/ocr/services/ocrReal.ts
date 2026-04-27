import apiClient from '@/services/apiClient';
import { get, post } from '@/services/apiClient';
import { handleApiError } from '@/services/apiError';
import { apiPath, API } from '@/config/endpoints';
import type { LaravelResource } from '@/services/apiError';
import type { OcrApiAdapter, OcrSession, ConfirmOcrPayload, ConfirmOcrResult } from './ocrApi';

export const ocrReal: OcrApiAdapter = {
  async upload(file: File): Promise<{ sessionId: string }> {
    try {
      const form = new FormData();
      form.append('file', file);
      const response = await apiClient.post<{ data: { session_id: string } }>(
        apiPath(API.OCR.UPLOAD),
        form,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );
      return { sessionId: response.data.data.session_id };
    } catch (err) {
      handleApiError(err);
    }
  },

  async getSession(sessionId: string): Promise<OcrSession> {
    try {
      const res = await get<LaravelResource<OcrSession>>(apiPath(API.OCR.SESSION(sessionId)));
      return res.data;
    } catch (err) {
      handleApiError(err);
    }
  },

  async confirmSession(sessionId: string, payload: ConfirmOcrPayload): Promise<ConfirmOcrResult> {
    try {
      const res = await post<LaravelResource<ConfirmOcrResult>>(
        apiPath(API.OCR.CONFIRM(sessionId)),
        payload,
      );
      return res.data;
    } catch (err) {
      handleApiError(err);
    }
  },
};
