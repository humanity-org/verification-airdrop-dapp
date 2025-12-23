/**
 * Error Handling Utilities
 * Centralized error processing, logging, and user notification
 */

import { useToastStore } from '../stores/toastStore';
import {
  ErrorCode,
  ErrorSeverity,
  type AppError,
  ERROR_MESSAGES,
  getErrorCategory,
} from '../types/errors';

/**
 * Create a structured AppError from a raw error
 */
export function createAppError(
  code: ErrorCode,
  originalError?: unknown,
  additionalContext?: Record<string, unknown>
): AppError {
  const errorInfo = ERROR_MESSAGES[code];
  const category = getErrorCategory(code);

  // Extract technical error message
  let technicalMessage = 'Unknown error';
  if (originalError instanceof Error) {
    technicalMessage = originalError.message;
  } else if (typeof originalError === 'string') {
    technicalMessage = originalError;
  }

  const appError: AppError = {
    code,
    category,
    severity: errorInfo.severity,
    message: technicalMessage,
    userMessage: errorInfo.userMessage,
    recoverable: errorInfo.recoverable,
    originalError,
    ...additionalContext,
  };

  // Only add action if it exists
  if (errorInfo.action !== undefined) {
    appError.action = errorInfo.action;
  }

  return appError;
}

/**
 * Parse Web3/Contract errors and map to appropriate ErrorCode
 */
export function parseContractError(error: unknown): ErrorCode {
  if (!(error instanceof Error)) {
    return ErrorCode.UNKNOWN_ERROR;
  }

  const message = error.message.toLowerCase();

  // Wallet rejections
  if (message.includes('user rejected') || message.includes('user denied')) {
    return ErrorCode.WALLET_USER_REJECTED;
  }

  // Insufficient funds
  if (message.includes('insufficient funds') || message.includes('insufficient balance')) {
    return ErrorCode.WALLET_INSUFFICIENT_FUNDS;
  }

  // Chain mismatch
  if (message.includes('chain') && (message.includes('mismatch') || message.includes('wrong'))) {
    return ErrorCode.WALLET_CHAIN_MISMATCH;
  }

  // Contract reverts
  if (message.includes('revert') || message.includes('execution reverted')) {
    return ErrorCode.CONTRACT_REVERT;
  }

  // Gas estimation
  if (message.includes('gas') && (message.includes('estimate') || message.includes('estimation'))) {
    return ErrorCode.CONTRACT_GAS_ESTIMATION_FAILED;
  }

  // Invalid address
  if (message.includes('invalid address')) {
    return ErrorCode.CONTRACT_INVALID_ADDRESS;
  }

  // Network errors
  if (message.includes('network') || message.includes('connection')) {
    return ErrorCode.NETWORK_CONNECTION_FAILED;
  }

  // RPC errors
  if (message.includes('rpc') || message.includes('provider')) {
    return ErrorCode.RPC_ERROR;
  }

  // Timeout
  if (message.includes('timeout')) {
    return ErrorCode.NETWORK_TIMEOUT;
  }

  // Default to contract execution failure
  return ErrorCode.CONTRACT_EXECUTION_FAILED;
}

/**
 * Check if error is a user rejection (should not show error toast)
 */
export function isUserRejection(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();
  return message.includes('user rejected') || message.includes('user denied');
}

/**
 * Central error handler - logs and shows user notification
 */
export function handleError(
  appError: AppError,
  context?: string
): void {
  // Log to console for debugging
  console.error(`[${context ?? 'Error'}]`, {
    code: appError.code,
    category: appError.category,
    severity: appError.severity,
    message: appError.message,
    userMessage: appError.userMessage,
    originalError: appError.originalError,
  });

  // Don't show toast for user rejections (user knows they rejected)
  if (appError.code === ErrorCode.WALLET_USER_REJECTED) {
    return;
  }

  // Show user-friendly notification
  // Map severity to toast type (warning -> info, error/fatal -> error)
  const toastType = appError.severity === ErrorSeverity.WARNING ? 'info' : 'error';

  // Combine message and action if action exists
  const toastMessage = appError.action
    ? `${appError.userMessage}. ${appError.action}`
    : appError.userMessage;

  useToastStore.getState().addToast({
    type: toastType,
    message: toastMessage,
    duration: appError.recoverable ? 5000 : 8000,
  });
}

/**
 * Parse and handle contract errors in one call
 */
export function handleContractError(
  error: unknown,
  context: string
): AppError {
  const errorCode = parseContractError(error);
  const appError = createAppError(errorCode, error);
  handleError(appError, context);
  return appError;
}

/**
 * Create and handle business logic errors
 */
export function handleBusinessError(
  code: ErrorCode,
  context: string,
  originalError?: unknown
): AppError {
  const appError = createAppError(code, originalError);
  handleError(appError, context);
  return appError;
}

/**
 * Helper to check if an error is recoverable
 */
export function isRecoverable(appError: AppError): boolean {
  return appError.recoverable;
}

/**
 * Helper to check if an error is fatal
 */
export function isFatal(appError: AppError): boolean {
  return appError.severity === ErrorSeverity.FATAL;
}
