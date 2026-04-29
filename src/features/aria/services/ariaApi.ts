export type AriaMessageRole = 'user' | 'assistant';

export interface AriaChatMessage {
  id: string;
  role: AriaMessageRole;
  content: string;
  createdAt: string;
  status?: 'sending' | 'sent' | 'failed';
}

export interface AriaConversation {
  id: string;
  title: string | null;
  messages: AriaChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface AriaUsage {
  used: number;
  limit: number;
  resetsAt: string;
}

export interface SendMessagePayload {
  conversationId: string;
  content: string;
}

export interface SendMessageResult {
  conversation: AriaConversation;
  messages: AriaChatMessage[];
  usage: AriaUsage;
}

export interface AriaApiAdapter {
  getConversations(): Promise<AriaConversation[]>;
  createConversation(): Promise<AriaConversation>;
  getUsage(): Promise<AriaUsage>;
  sendMessage(payload: SendMessagePayload): Promise<SendMessageResult>;
}
