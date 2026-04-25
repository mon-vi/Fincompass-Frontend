/**
 * Shared primitive and utility types used across the application.
 */

export type ID = string;

export type Nullable<T> = T | null;

export type Maybe<T> = T | null | undefined;

export type Dict<T = unknown> = Record<string, T>;

/** Standard paginated response envelope from the API. */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** Standard API error shape. */
export interface ApiError {
  message: string;
  code?: string;
  field?: string;
  details?: Dict;
}

/** Standard API response envelope. */
export interface ApiResponse<T> {
  data: T;
  message?: string;
}
