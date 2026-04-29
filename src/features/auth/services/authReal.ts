import { get, post } from '@/services/apiClient';
import { handleApiError } from '@/services/apiError';
import { apiPath, API } from '@/config/endpoints';
import type { LaravelResource } from '@/services/apiError';
import type { AuthApiAdapter, AuthResponse, MessageResponse } from './authApi';
import type { LoginPayload, RegisterPayload, UserTier } from '@/types/auth';

interface LaravelUser {
  id: string;
  email: string;
  name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  tier?: UserTier;
  onboarding_status?: 'pending' | 'complete';
  profile?: {
    is_onboarding_complete?: boolean;
    onboarding_completed_at?: string | null;
  } | null;
  subscription?: {
    plan_tier?: UserTier | null;
    tier?: UserTier | null;
    plan?: UserTier | null;
  } | null;
  created_at: string;
  updated_at?: string;
}

interface LaravelAuthResponse {
  user: LaravelUser;
  token: string;
}

function splitName(raw: LaravelUser) {
  const nameParts = (raw.name ?? '').trim().split(/\s+/).filter(Boolean);
  return {
    firstName: raw.first_name ?? nameParts[0] ?? '',
    lastName: raw.last_name ?? nameParts.slice(1).join(' ') ?? '',
  };
}

function mapUser(raw: LaravelUser): AuthResponse['user'] {
  const { firstName, lastName } = splitName(raw);
  const onboardingComplete = raw.profile?.is_onboarding_complete || !!raw.profile?.onboarding_completed_at;

  return {
    id: raw.id,
    email: raw.email,
    firstName,
    lastName,
    tier: raw.subscription?.plan_tier ?? raw.subscription?.tier ?? raw.subscription?.plan ?? raw.tier ?? 'compass',
    onboardingStatus: raw.onboarding_status ?? (onboardingComplete ? 'complete' : 'pending'),
    createdAt: raw.created_at,
    updatedAt: raw.updated_at ?? raw.created_at,
  };
}

function mapAuth(raw: LaravelAuthResponse): AuthResponse {
  return {
    user: mapUser(raw.user),
    tokens: {
      accessToken: raw.token,
    },
  };
}

export const authReal: AuthApiAdapter = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    try {
      const res = await post<LaravelResource<LaravelAuthResponse>>(apiPath(API.AUTH.LOGIN), {
        email: payload.email,
        password: payload.password,
      });
      return mapAuth(res.data);
    } catch (err) {
      handleApiError(err);
    }
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    try {
      const res = await post<LaravelResource<LaravelAuthResponse>>(apiPath(API.AUTH.REGISTER), {
        name: `${payload.firstName} ${payload.lastName}`.trim(),
        email: payload.email,
        password: payload.password,
        password_confirmation: payload.password,
      });
      return mapAuth(res.data);
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

export async function getMeReal(): Promise<AuthResponse['user']> {
  try {
    const res = await get<LaravelResource<LaravelUser>>(apiPath(API.AUTH.ME));
    return mapUser(res.data);
  } catch (err) {
    handleApiError(err);
  }
}
