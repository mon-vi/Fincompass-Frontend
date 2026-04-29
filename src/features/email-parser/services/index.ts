import { emailParserReal } from './emailParserReal';
import type { EmailParserApiAdapter } from './emailParserApi';

export const emailParserAdapter: EmailParserApiAdapter = emailParserReal;

export type { ApplyEmailParserEventPayload, EmailParserApiAdapter, EmailParserEvent, EmailParserEventStatus, EmailParserForwardingAddress } from './emailParserApi';
