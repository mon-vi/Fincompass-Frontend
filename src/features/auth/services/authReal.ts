import { get, post } from '@/services/apiClient';
import { handleApiError } from '@/services/apiError';
import { apiPath, API } from '@/config/endpoints';
import type { AuthApiAdapter, AuthResponse, MessageResponse } from './authApi';
import type { LoginPayload, RegisterPayload } from '@/types/auth';

/**
 * Real adapter assumptions (confirm with Laravel team before enabling):
 * - POST /api/v1/auth/login  → { user: { id, email, first_name, last_name, tier, onboarding_status, ... }, access_token, refresh_token, expires_in }
 * - POST /api/v1/auth/register → same shape as login
 * - POST /api/v1/auth/logout → { message: 'OK' } or 204
 * - POST /api/v1/auth/forgot-password → { message: '...' }
 * - POST /api/v1/auth/reset-password → { message: '...' }
 * Field names are snake_case; mapped to camelCase here.
 */

interface LaravelUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  tier: 'compass' | 'navigator' | 'cfo';
  onboarding_status: 'pending' | 'complete';
  created_at: string;
  updated_at: string;
}

interface LaravelAuthResponse {
  user: LaravelUser;
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

function mapUser(raw: LaravelUser): AuthResponse['user'] {
  return {
    id: raw.id,
    email: raw.email,
    firstName: raw.first_name,
    lastName: raw.last_name,
    tier: raw.tier,
    onboardingStatus: raw.onboarding_status,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

function mapAuth(raw: LaravelAuthResponse): AuthResponse {
  return {
    user: mapUser(raw.user),
    tokens: {
      accessToken: raw.access_token,
      refreshToken: raw.refresh_token,
      expiresIn: raw.expires_in,
    },
  };
}

export const authReal: AuthApiAdapter = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    try {
      const raw = await post<LaravelAuthResponse>(apiPath(API.AUTH.LOGIN), {
        email: payload.email,
        password: payload.password,
      });
      return mapAuth(raw);
    } catch (err) {
      handleApiError(err);
    }
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    try {
      const raw = await post<LaravelAuthResponse>(apiPath(API.AUTH.REGISTER), {
        email: payload.email,
        password: payload.password,
        first_name: payload.firstName,
        last_name: payload.lastName,
      });
      return mapAuth(raw);
    } catch (err) {
      handleApiError(err);
    }
  },

  async forgotPassword(email: string): Promise<MessageResponse> {
    try {
      return await post<MessageResponse>(apiPath(API.AUTH.FORGOT_PASSWORD), { email });
    } catch (err) {
      handleApiError(err);
    }
  },

  async resetPassword(token: string, password: string): Promise<MessageResponse> {
    try {
      return await post<MessageResponse>(apiPath(API.AUTH.RESET_PASSWORD), {
        token,
        password,
        password_confirmation: password,
      });
    } catch (err) {
      handleApiError(err);
    }
  },

  async logout(): Promise<void> {
    try {
      await post<unknown>(apiPath(API.AUTH.LOGOUT));
    } catch {
      // Swallow — local auth state is cleared regardless
    }
  },
};

export async function refreshTokenReal(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
  const raw = await post<{ access_token: string; refresh_token: string }>(
    apiPath(API.AUTH.REFRESH),
    { refresh_token: refreshToken },
  );
  return { accessToken: raw.access_token, refreshToken: raw.refresh_token };
}

export async function getMeReal(): Promise<AuthResponse['user']> {
  try {
    const raw = await get<LaravelUser>(apiPath(API.AUTH.ME));
    return mapUser(raw);
  } catch (err) {
    handleApiError(err);
  }
}
