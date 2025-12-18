/**
 * Core business logic and utilities
 * @packageDocumentation
 */

import type { ApiResponse, Config } from '@hp/types';

/**
 * Default configuration
 */
export const defaultConfig: Config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
  retries: 3,
};

/**
 * Fetches data from an API endpoint
 * @param endpoint - API endpoint path
 * @param config - Optional configuration overrides
 * @returns Promise resolving to API response
 */
export async function fetchData<T>(
  endpoint: string,
  config: Partial<Config> = {}
): Promise<ApiResponse<T>> {
  const finalConfig = { ...defaultConfig, ...config };

  try {
    const response = await fetch(`${finalConfig.apiUrl}${endpoint}`, {
      signal: AbortSignal.timeout(finalConfig.timeout),
    });

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      data: data as T,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Delays execution for a specified time
 * @param ms - Milliseconds to delay
 * @returns Promise that resolves after the delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retries an async function with exponential backoff
 * @param fn - Async function to retry
 * @param maxRetries - Maximum number of retry attempts
 * @param baseDelay - Base delay in milliseconds
 * @returns Promise resolving to function result
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < maxRetries) {
        const delayMs = baseDelay * Math.pow(2, attempt);
        await delay(delayMs);
      }
    }
  }

  throw lastError || new Error('Max retries exceeded');
}
