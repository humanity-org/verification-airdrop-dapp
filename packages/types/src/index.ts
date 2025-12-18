/**
 * Shared TypeScript type definitions
 * @packageDocumentation
 */

/**
 * User interface representing a user entity
 */
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * API response wrapper type
 */
export type ApiResponse<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: string;
};

/**
 * Common status types
 */
export type Status = 'idle' | 'loading' | 'success' | 'error';

/**
 * Configuration options type
 */
export interface Config {
  apiUrl: string;
  timeout: number;
  retries: number;
}
