import { get, patch } from '@/services/apiClient';
import { handleApiError } from '@/services/apiError';
import { apiPath, API } from '@/config/endpoints';
import type { LaravelCollection, LaravelResource } from '@/services/apiError';
import type { ApplyEmailParserEventPayload, EmailParserApiAdapter, EmailParserEvent, EmailParserForwardingAddress } from './emailParserApi';

interface LaravelEmailParserEvent {
  id: string;
  status?: EmailParserEvent['status'];
  subject?: string | null;
  sender?: string | null;
  received_at?: string | null;
  matched_type?: 'expense' | 'debt' | null;
  matched_id?: string | null;
  parsed_data?: Record<string, unknown>;
  error_message?: string | null;
}

function mapEvent(event: LaravelEmailParserEvent): EmailParserEvent {
  return {
    id: event.id,
    status: event.status ?? 'unmatched',
    subject: event.subject ?? null,
    sender: event.sender ?? null,
    receivedAt: event.received_at ?? null,
    matchedType: event.matched_type ?? null,
    matchedId: event.matched_id ?? null,
    parsedData: event.parsed_data ?? {},
    errorMessage: event.error_message ?? null,
  };
}

export const emailParserReal: EmailParserApiAdapter = {
  async getForwardingAddress(): Promise<EmailParserForwardingAddress | null> {
    try {
      const res = await get<LaravelResource<{ address: string } | null> | { address: string } | null>(apiPath(API.EMAIL_PARSER.FORWARDING_ADDRESS));
      if (!res) return null;
      return 'data' in res ? res.data : res;
    } catch (err) {
      handleApiError(err);
    }
  },

  async listEvents(): Promise<EmailParserEvent[]> {
    try {
      const res = await get<LaravelCollection<LaravelEmailParserEvent>>(apiPath(API.EMAIL_PARSER.EVENTS));
      return res.data.map(mapEvent);
    } catch (err) {
      handleApiError(err);
    }
  },

  async getEvent(id: string): Promise<EmailParserEvent> {
    try {
      const res = await get<LaravelResource<LaravelEmailParserEvent>>(apiPath(API.EMAIL_PARSER.EVENT(id)));
      return mapEvent(res.data);
    } catch (err) {
      handleApiError(err);
    }
  },

  async applyEvent(id: string, payload?: ApplyEmailParserEventPayload): Promise<void> {
    try {
      await patch<unknown>(apiPath(API.EMAIL_PARSER.APPLY(id)), {
        target_id: payload?.targetId,
        target_type: payload?.targetType,
      });
    } catch (err) {
      handleApiError(err);
    }
  },

  async dismissEvent(id: string): Promise<EmailParserEvent> {
    try {
      const res = await patch<LaravelResource<LaravelEmailParserEvent>>(apiPath(API.EMAIL_PARSER.DISMISS(id)));
      return mapEvent(res.data);
    } catch (err) {
      handleApiError(err);
    }
  },
};
