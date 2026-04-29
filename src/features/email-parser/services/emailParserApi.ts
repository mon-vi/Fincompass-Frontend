export type EmailParserEventStatus = 'pending' | 'review_ready' | 'matched' | 'unmatched' | 'applied' | 'dismissed' | 'ignored' | 'failed';

export interface EmailParserForwardingAddress {
  address: string;
}

export interface EmailParserEvent {
  id: string;
  status: EmailParserEventStatus;
  subject: string | null;
  sender: string | null;
  receivedAt: string | null;
  matchedType: 'expense' | 'debt' | null;
  matchedId: string | null;
  parsedData: Record<string, unknown>;
  errorMessage: string | null;
}

export interface ApplyEmailParserEventPayload {
  targetId?: string;
  targetType?: 'expense' | 'debt';
}

export interface EmailParserApiAdapter {
  getForwardingAddress(): Promise<EmailParserForwardingAddress | null>;
  listEvents(): Promise<EmailParserEvent[]>;
  getEvent(id: string): Promise<EmailParserEvent>;
  applyEvent(id: string, payload?: ApplyEmailParserEventPayload): Promise<void>;
  dismissEvent(id: string): Promise<EmailParserEvent>;
}
