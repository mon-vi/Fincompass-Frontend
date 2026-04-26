import type { AuthApiAdapter } from './authApi';
import { authMock } from './authMock';
import { ENV } from '@/constants/env';

// Real adapter: import { authReal } from './authReal' once the Laravel API is live.
// Swap: ENV.USE_MOCK_API ? authMock : authReal
export const authAdapter: AuthApiAdapter = ENV.USE_MOCK_API ? authMock : authMock;

export type { AuthApiAdapter, AuthResponse, MessageResponse } from './authApi';
