export type AriaMessageRole = 'user' | 'assistant';

export interface AriaChatMessage {
  id: string;
  role: AriaMessageRole;
  content: string;
  createdAt: string;
}

export interface AriaUsage {
  used: number;
  limit: number;
  resetsAt: string;
}

export interface SendMessagePayload {
  content: string;
}

export interface SendMessageResult {
  message: AriaChatMessage;
  usage: AriaUsage;
}

export interface AriaApiAdapter {
  getHistory(): Promise<AriaChatMessage[]>;
  getUsage(): Promise<AriaUsage>;
  sendMessage(payload: SendMessagePayload): Promise<SendMessageResult>;
}
