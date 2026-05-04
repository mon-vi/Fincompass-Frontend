import { describe, expect, it } from 'vitest';
import { DEFAULT_API_BASE_URL, normalizeApiBaseUrl } from './env';
import { API, apiPath, apiUrl } from '@/config/endpoints';

describe('API base URL handling', () => {
  it('defaults local frontend calls to the deployed Render backend', () => {
    expect(normalizeApiBaseUrl(undefined)).toBe(DEFAULT_API_BASE_URL);
  });

  it('does not duplicate api version when env includes /api/v1', () => {
    const base = normalizeApiBaseUrl('https://fincompass-backend.onrender.com/api/v1/');

    expect(`${base}${apiPath(API.AUTH.LOGIN)}`).toBe('https://fincompass-backend.onrender.com/api/v1/auth/login');
    expect(`${base}${apiPath(API.AUTH.REGISTER)}`).toBe('https://fincompass-backend.onrender.com/api/v1/auth/register');
  });

  it('builds final API URLs with or without api version in the base URL', () => {
    expect(apiUrl('https://fincompass-backend.onrender.com', API.DASHBOARD)).toBe('https://fincompass-backend.onrender.com/api/v1/dashboard');
    expect(apiUrl('https://fincompass-backend.onrender.com/api/v1', API.DASHBOARD)).toBe('https://fincompass-backend.onrender.com/api/v1/dashboard');
  });

  it('normalizes endpoint paths that accidentally include api version', () => {
    expect(apiPath('/api/v1/auth/login')).toBe('/api/v1/auth/login');
    expect(apiPath('auth/register')).toBe('/api/v1/auth/register');
  });
});
