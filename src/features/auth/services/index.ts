import type { AuthApiAdapter } from './authApi';
import { authMock } from './authMock';
import { authReal } from './authReal';
import { ENV } from '@/constants/env';

export const authAdapter: AuthApiAdapter = ENV.USE_MOCK_API ? authMock : authReal;

export type { AuthApiAdapter, AuthResponse, MessageResponse } from './authApi';
