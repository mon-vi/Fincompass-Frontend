import { beforeEach, describe, expect, it, vi } from 'vitest';
import { authReal, getMeReal } from './authReal';

const api = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
}));

vi.mock('@/services/apiClient', () => ({
  get: api.get,
  post: api.post,
}));

const backendUser = {
  id: 'user-1',
  name: 'Jane Smith',
  email: 'jane@example.com',
  profile: { is_onboarding_complete: true },
  subscription: { plan_tier: 'navigator' },
  created_at: '2026-04-29T00:00:00Z',
};

describe('authReal', () => {
  beforeEach(() => {
    api.get.mockReset();
    api.post.mockReset();
  });

  it('maps login envelope with Sanctum token', async () => {
    api.post.mockResolvedValue({ data: { user: backendUser, token: 'plain-token' } });

    const result = await authReal.login({ email: 'jane@example.com', password: 'password' });

    expect(api.post).toHaveBeenCalledWith('/api/v1/auth/login', { email: 'jane@example.com', password: 'password' });
    expect(result.tokens.accessToken).toBe('plain-token');
    expect(result.user.tier).toBe('navigator');
    expect(result.user.onboardingStatus).toBe('complete');
  });

  it('sends backend register payload', async () => {
    api.post.mockResolvedValue({ data: { user: backendUser, token: 'plain-token' } });

    await authReal.register({ firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', password: 'password' });

    expect(api.post).toHaveBeenCalledWith('/api/v1/auth/register', {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'password',
      password_confirmation: 'password',
    });
  });

  it('loads current user from users me endpoint', async () => {
    api.get.mockResolvedValue({ data: backendUser });

    const user = await getMeReal();

    expect(api.get).toHaveBeenCalledWith('/api/v1/users/me');
    expect(user.firstName).toBe('Jane');
  });
});
