import axios from 'axios';

/**
 * Typed API error that carries HTTP status, a machine-readable code,
 * and optional per-field validation errors from Laravel's 422 response.
 */
export class ApiError extends Error {
  readonly code: string;
  readonly status: number | undefined;
  readonly fieldErrors: Record<string, string[]> | undefined;

  constructor(
    message: string,
    code: string,
    status?: number,
    fieldErrors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.fieldErrors = fieldErrors;
  }

  get isValidation() { return this.status === 422; }
  get isUnauthorized() { return this.status === 401; }
  get isForbidden() { return this.status === 403; }
  get isNotFound() { return this.status === 404; }
  get isRateLimited() { return this.status === 429; }
  get isServerError() { return (this.status ?? 0) >= 500; }
  get isNetwork() { return this.code === 'NETWORK_ERROR'; }
}

/** Laravel error response body shape. */
interface LaravelErrorBody {
  message?: string;
  errors?: Record<string, string[]>;
}

/**
 * Call inside every real adapter's catch block.
 * Normalises Axios errors and plain Error objects into ApiError and re-throws.
 */
export function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const body = error.response?.data as LaravelErrorBody | undefined;
    const message = body?.message ?? error.message;

    if (!error.response) {
      throw new ApiError(
        'Cannot reach the server. Check your connection.',
        'NETWORK_ERROR',
      );
    }
    if (status === 401) {
      throw new ApiError('Session expired. Please sign in again.', 'UNAUTHORIZED', 401);
    }
    if (status === 403) {
      throw new ApiError('You do not have permission to do this.', 'FORBIDDEN', 403);
    }
    if (status === 404) {
      throw new ApiError('The requested resource was not found.', 'NOT_FOUND', 404);
    }
    if (status === 422) {
      throw new ApiError(
        message ?? 'Validation failed.',
        'VALIDATION_ERROR',
        422,
        body?.errors,
      );
    }
    if (status === 429) {
      throw new ApiError('Too many requests. Please slow down.', 'RATE_LIMITED', 429);
    }
    if (status !== undefined && status >= 500) {
      throw new ApiError('Server error. Please try again later.', 'SERVER_ERROR', status);
    }
    throw new ApiError(message ?? 'An unexpected error occurred.', 'API_ERROR', status);
  }

  if (error instanceof Error) {
    throw new ApiError(error.message, 'UNKNOWN_ERROR');
  }

  throw new ApiError('An unexpected error occurred.', 'UNKNOWN_ERROR');
}

/**
 * Typed Laravel response envelopes.
 * Real adapters import these to unwrap `response.data` cleanly.
 */
export interface LaravelResource<T> {
  data: T;
  message?: string;
}

export interface LaravelCollection<T> {
  data: T[];
  links?: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface LaravelMessage {
  message: string;
}
