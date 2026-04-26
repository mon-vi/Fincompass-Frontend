import type { AuthApiAdapter, AuthResponse, MessageResponse } from './authApi';
import type { LoginPayload, RegisterPayload, User } from '@/types/auth';

const MOCK_DELAY_MS = 800;

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const buildUser = (email: string, firstName: string, lastName: string): User => ({
  id: crypto.randomUUID(),
  email,
  firstName,
  lastName,
  tier: 'compass',
  onboardingStatus: 'pending',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const buildTokens = () => ({
  accessToken: `mock_access_${Date.now()}`,
  refreshToken: `mock_refresh_${Date.now()}`,
  expiresIn: 3600,
});

export const authMock: AuthApiAdapter = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    await delay(MOCK_DELAY_MS);
    if (
      payload.email !== 'demo@fincompass.app' ||
      payload.password !== 'Password1'
    ) {
      throw new Error('Invalid email or password');
    }
    return { user: buildUser(payload.email, 'Demo', 'User'), tokens: buildTokens() };
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    await delay(MOCK_DELAY_MS);
    if (payload.email === 'taken@fincompass.app') {
      throw new Error('An account with this email already exists');
    }
    return {
      user: buildUser(payload.email, payload.firstName, payload.lastName),
      tokens: buildTokens(),
    };
  },

  async forgotPassword(_email: string): Promise<MessageResponse> {
    await delay(MOCK_DELAY_MS);
    return {
      message: 'If an account exists for that email, a reset link has been sent.',
    };
  },

  async resetPassword(token: string, _password: string): Promise<MessageResponse> {
    await delay(MOCK_DELAY_MS);
    if (token === 'invalid') {
      throw new Error('This reset link is invalid or has expired');
    }
    return { message: 'Your password has been reset. You can now sign in.' };
  },

  async logout(): Promise<void> {
    await delay(200);
  },
};
