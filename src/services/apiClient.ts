import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { ENV } from '@/constants/env';
import { TOKEN_KEYS } from '@/stores/authStore';
import { apiPath, API } from '@/config/endpoints';

/**
 * Core Axios instance for all FinCompass API calls.
 *
 * Responsibilities:
 * - Attach bearer token from localStorage on every request
 * - Silent token refresh on 401: call /auth/refresh, retry original request
 * - If refresh fails: clear auth state and redirect to /login
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: ENV.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    // Required by Laravel to return JSON error responses instead of HTML redirects
    Accept: 'application/json',
  },
});

// ── Request interceptor: attach bearer token ──────────────────────────────────

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem(TOKEN_KEYS.ACCESS);
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor: silent token refresh ────────────────────────────────

/**
 * Queue of requests that arrived while a refresh was already in-flight.
 * Each entry holds resolve/reject callbacks for the retry Promise.
 */
interface QueueEntry {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}

let isRefreshing = false;
let failedQueue: QueueEntry[] = [];

function flushQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((entry) => {
    if (error) {
      entry.reject(error);
    } else {
      entry.resolve(token!);
    }
  });
  failedQueue = [];
}

type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) return Promise.reject(error);

    const originalRequest = error.config as RetryableConfig | undefined;
    const status = error.response?.status;

    // Only attempt refresh for 401s that haven't already been retried
    if (status !== 401 || !originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    // If another refresh is already in-flight, queue this request
    if (isRefreshing) {
      return new Promise<AxiosResponse>((resolve, reject) => {
        failedQueue.push({
          resolve: (token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(apiClient(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = localStorage.getItem(TOKEN_KEYS.REFRESH);

    // No refresh token stored → clear auth and redirect immediately
    if (!refreshToken) {
      isRefreshing = false;
      const { useAuthStore } = await import('@/stores/authStore');
      useAuthStore.getState().clearAuth();
      window.location.href = '/login';
      return Promise.reject(error);
    }

    try {
      // Use a bare axios instance (not apiClient) to avoid triggering this interceptor again
      const refreshResponse = await axios.post<{
        access_token: string;
        refresh_token: string;
        expires_in: number;
      }>(
        `${ENV.API_BASE_URL}${apiPath(API.AUTH.REFRESH)}`,
        { refresh_token: refreshToken },
        { headers: { 'Content-Type': 'application/json', Accept: 'application/json' } },
      );

      const { access_token, refresh_token } = refreshResponse.data;
      localStorage.setItem(TOKEN_KEYS.ACCESS, access_token);
      localStorage.setItem(TOKEN_KEYS.REFRESH, refresh_token);

      flushQueue(null, access_token);

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
      }
      return apiClient(originalRequest);
    } catch (refreshError) {
      flushQueue(refreshError, null);
      const { useAuthStore } = await import('@/stores/authStore');
      useAuthStore.getState().clearAuth();
      window.location.href = '/login';
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

// ── Typed HTTP helpers ─────────────────────────────────────────────────────────

export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.get<T>(url, config);
  return response.data;
}

export async function post<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.post<T>(url, data, config);
  return response.data;
}

export async function put<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.put<T>(url, data, config);
  return response.data;
}

export async function patch<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.patch<T>(url, data, config);
  return response.data;
}

export async function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.delete<T>(url, config);
  return response.data;
}

export default apiClient;
