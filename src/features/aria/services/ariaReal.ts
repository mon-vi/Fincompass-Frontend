import apiClient from '@/services/apiClient';
import { handleApiError } from '@/services/apiError';
import type { LaravelResource, LaravelCollection } from '@/services/apiError';
import type { AriaApiAdapter, AriaChatMessage, AriaUsage, SendMessagePayload, SendMessageResult } from './ariaApi';

interface LaravelAriaMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

interface LaravelAriaUsage {
  used: number;
  limit: number;
  resets_at: string;
}

function mapMessage(m: LaravelAriaMessage): AriaChatMessage {
  return { id: m.id, role: m.role, content: m.content, createdAt: m.created_at };
}

function mapUsage(u: LaravelAriaUsage): AriaUsage {
  return { used: u.used, limit: u.limit, resetsAt: u.resets_at };
}

export const ariaReal: AriaApiAdapter = {
  async getHistory() {
    try {
      const { data } = await apiClient.get<LaravelCollection<LaravelAriaMessage>>('/api/v1/aria/messages');
      return data.data.map(mapMessage);
    } catch (e) {
      handleApiError(e);
    }
  },

  async getUsage() {
    try {
      const { data } = await apiClient.get<LaravelResource<LaravelAriaUsage>>('/api/v1/aria/usage');
      return mapUsage(data.data);
    } catch (e) {
      handleApiError(e);
    }
  },

  async sendMessage(payload: SendMessagePayload): Promise<SendMessageResult> {
    try {
      const { data } = await apiClient.post<LaravelResource<{ message: LaravelAriaMessage; usage: LaravelAriaUsage }>>(
        '/api/v1/aria/messages',
        { content: payload.content },
      );
      return { message: mapMessage(data.data.message), usage: mapUsage(data.data.usage) };
    } catch (e) {
      handleApiError(e);
    }
  },
};
