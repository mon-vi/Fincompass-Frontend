import type { OcrApiAdapter, OcrSession, ConfirmOcrPayload, ConfirmOcrResult } from './ocrApi';

const delay = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

const mockSessions = new Map<string, OcrSession>();

export const ocrMock: OcrApiAdapter = {
  async upload(file: File): Promise<{ sessionId: string }> {
    await delay(1200);
    const sessionId = `ocr-${Date.now()}`;
    mockSessions.set(sessionId, {
      id: sessionId,
      status: 'processing',
      fileName: file.name,
      fileSize: file.size,
      uploadedAt: new Date().toISOString(),
      processedAt: null,
      extractedExpenses: [],
      errorMessage: null,
    });
    // Simulate async processing: after 2 s the session becomes "ready"
    setTimeout(() => {
      const session = mockSessions.get(sessionId);
      if (!session) return;
      mockSessions.set(sessionId, {
        ...session,
        status: 'ready',
        processedAt: new Date().toISOString(),
        extractedExpenses: [
          { id: 'ocr-exp-1', amount: 87.43, description: 'Whole Foods Market', date: new Date().toISOString().slice(0, 10), suggestedCategory: 'food', confidence: 0.94 },
          { id: 'ocr-exp-2', amount: 45.00, description: 'Shell Gas Station', date: new Date().toISOString().slice(0, 10), suggestedCategory: 'transportation', confidence: 0.91 },
          { id: 'ocr-exp-3', amount: 120.00, description: 'CVS Pharmacy', date: new Date().toISOString().slice(0, 10), suggestedCategory: 'healthcare', confidence: 0.78 },
          { id: 'ocr-exp-4', amount: 14.99, description: 'Netflix', date: new Date().toISOString().slice(0, 10), suggestedCategory: 'entertainment', confidence: 0.97 },
        ],
      });
    }, 2000);
    return { sessionId };
  },

  async getSession(sessionId: string): Promise<OcrSession> {
    await delay(300);
    const session = mockSessions.get(sessionId);
    if (!session) throw new Error('OCR session not found');
    return { ...session, extractedExpenses: session.extractedExpenses.map((e) => ({ ...e })) };
  },

  async confirmSession(sessionId: string, payload: ConfirmOcrPayload): Promise<ConfirmOcrResult> {
    await delay(800);
    const session = mockSessions.get(sessionId);
    if (!session) throw new Error('OCR session not found');
    mockSessions.set(sessionId, { ...session, status: 'confirmed' });
    return { imported: payload.selectedIds.length };
  },
};
