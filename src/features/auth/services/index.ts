import type { AuthApiAdapter } from './authApi';
import { authReal } from './authReal';

export const authAdapter: AuthApiAdapter = authReal;

export type { AuthApiAdapter, AuthResponse, MessageResponse } from './authApi';
