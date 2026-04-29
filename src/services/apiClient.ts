import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { ENV } from '@/constants/env';
import { TOKEN_KEYS } from '@/stores/authStore';

/**
 * Core Axios instance for all FinCompass API calls.
 *
 * Responsibilities:
 * - Attach bearer token from localStorage on every request
 * - Clear auth state and redirect to /login on 401
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

// ── Response interceptor: clear invalid Sanctum token ─────────────────────────

apiClient.interceptors.response.use(undefined, async (error: unknown) => {
  if (axios.isAxiosError(error) && error.response?.status === 401) {
    const { useAuthStore } = await import('@/stores/authStore');
    useAuthStore.getState().clearAuth();
    window.location.href = '/login';
  }
  return Promise.reject(error);
});

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
