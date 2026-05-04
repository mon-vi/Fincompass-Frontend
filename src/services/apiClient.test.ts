import { beforeEach, describe, expect, it } from 'vitest';
import type { InternalAxiosRequestConfig } from 'axios';
import { attachBearerToken } from './apiClient';
import { TOKEN_KEYS } from '@/stores/authStore';

describe('apiClient auth headers', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('attaches Authorization bearer token to authenticated requests', () => {
    localStorage.setItem(TOKEN_KEYS.ACCESS, 'stored-token');
    const config = { headers: {} } as InternalAxiosRequestConfig;

    const result = attachBearerToken(config);

    expect(result.headers.Authorization).toBe('Bearer stored-token');
  });

  it('leaves Authorization unset when no token is stored', () => {
    const config = { headers: {} } as InternalAxiosRequestConfig;

    const result = attachBearerToken(config);

    expect(result.headers.Authorization).toBeUndefined();
  });
});
