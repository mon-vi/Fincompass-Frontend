import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ocrAdapter } from '../services';
import { expenseKeys } from '@/features/expenses/hooks';
import type { ConfirmOcrPayload } from '../services';

export const ocrKeys = {
  session: (id: string) => ['ocr', 'session', id] as const,
};

export function useOcrSession(sessionId: string | null) {
  const query = useQuery({
    queryKey: ocrKeys.session(sessionId ?? ''),
    queryFn: () => ocrAdapter.getSession(sessionId!),
    enabled: !!sessionId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      // Poll every 1.5 s while the session is still processing
      return status === 'processing' || status === 'uploading' ? 1500 : false;
    },
  });
  return query;
}

export function useOcrUpload() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const upload = useMutation({
    mutationFn: (file: File) => ocrAdapter.upload(file),
    onSuccess: (result) => setSessionId(result.sessionId),
  });
  return { ...upload, sessionId };
}

export function useOcrConfirm(sessionId: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ConfirmOcrPayload) => ocrAdapter.confirmSession(sessionId!, payload),
    onSuccess: () => {
      // Invalidate expenses so the imported items appear
      void qc.invalidateQueries({ queryKey: expenseKeys.all });
      if (sessionId) {
        void qc.invalidateQueries({ queryKey: ocrKeys.session(sessionId) });
      }
    },
  });
}

/** Controlled set of selected expense IDs for the review screen. */
export function useOcrSelection(extractedIds: string[]) {
  const idKey = extractedIds.join(',');
  const [prevKey, setPrevKey] = useState(idKey);
  const [selected, setSelected] = useState<Set<string>>(new Set(extractedIds));

  // Reset selection when the list of available IDs changes (new session loaded).
  if (prevKey !== idKey) {
    setPrevKey(idKey);
    setSelected(new Set(extractedIds));
  }

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const selectAll = () => setSelected(new Set(extractedIds));
  const clearAll = () => setSelected(new Set());

  return { selected, toggle, selectAll, clearAll };
}
