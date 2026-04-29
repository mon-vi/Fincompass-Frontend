import apiClient from '@/services/apiClient';
import { handleApiError } from '@/services/apiError';
import { apiPath, API } from '@/config/endpoints';
import type { LaravelResource, LaravelCollection } from '@/services/apiError';
import type { AriaApiAdapter, AriaChatMessage, AriaConversation, AriaUsage, SendMessagePayload, SendMessageResult } from './ariaApi';

interface LaravelAriaMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

interface LaravelAriaConversation {
  id: string;
  title?: string | null;
  messages?: LaravelAriaMessage[];
  created_at?: string;
  updated_at?: string;
}

interface LaravelAriaUsage {
  month?: string;
  messages_used: number;
  messages_limit: number;
  messages_remaining?: number;
  resets_at?: string | null;
}

function mapMessage(m: LaravelAriaMessage): AriaChatMessage {
  return { id: m.id, role: m.role, content: m.content, createdAt: m.created_at };
}

function mapConversation(conversation: LaravelAriaConversation): AriaConversation {
  return {
    id: conversation.id,
    title: conversation.title ?? null,
    messages: (conversation.messages ?? []).map(mapMessage),
    createdAt: conversation.created_at ?? '',
    updatedAt: conversation.updated_at ?? conversation.created_at ?? '',
  };
}

function mapUsage(u: LaravelAriaUsage): AriaUsage {
  return { used: u.messages_used, limit: u.messages_limit, resetsAt: u.resets_at ?? u.month ?? null };
}

export const ariaReal: AriaApiAdapter = {
  async getConversations() {
    try {
      const { data } = await apiClient.get<LaravelCollection<LaravelAriaConversation>>(apiPath(API.ARIA.CONVERSATIONS));
      return data.data.map(mapConversation);
    } catch (e) {
      handleApiError(e);
    }
  },

  async createConversation() {
    try {
      const { data } = await apiClient.post<LaravelResource<LaravelAriaConversation>>(apiPath(API.ARIA.CONVERSATIONS));
      return mapConversation(data.data);
    } catch (e) {
      handleApiError(e);
    }
  },

  async getUsage() {
    try {
      const { data } = await apiClient.get<LaravelResource<LaravelAriaUsage>>(apiPath(API.ARIA.USAGE));
      return mapUsage(data.data);
    } catch (e) {
      handleApiError(e);
    }
  },

  async sendMessage(payload: SendMessagePayload): Promise<SendMessageResult> {
    try {
      const { data } = await apiClient.post<LaravelResource<{
        conversation?: LaravelAriaConversation;
        messages?: LaravelAriaMessage[];
        user_message?: LaravelAriaMessage;
        message?: LaravelAriaMessage;
        assistant_message?: LaravelAriaMessage;
        usage: LaravelAriaUsage;
      }>>(
        apiPath(API.ARIA.CONVERSATION_MESSAGES(payload.conversationId)),
        { message: payload.content },
      );

      const conversation = data.data.conversation ? mapConversation(data.data.conversation) : {
        id: payload.conversationId,
        title: null,
        messages: [],
        createdAt: '',
        updatedAt: '',
      };
      const messages = data.data.messages?.map(mapMessage)
        ?? [data.data.user_message, data.data.assistant_message ?? data.data.message]
          .filter(Boolean)
          .map((message) => mapMessage(message!));
      return { conversation, messages, usage: mapUsage(data.data.usage) };
    } catch (e) {
      handleApiError(e);
    }
  },
};
