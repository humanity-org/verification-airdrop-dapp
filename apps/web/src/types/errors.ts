/**
 * Error Handling System
 * 
 * Provides unified error classification, user-friendly messages,
 * and actionable recovery suggestions for the application.
 */

/**
 * Error Codes - Categorized by error type
 */
export enum ErrorCode {
  // Network Errors (1xxx)
  NETWORK_CONNECTION_FAILED = 1001,
  NETWORK_TIMEOUT = 1002,
  RPC_ERROR = 1003,
  
  // Wallet Errors (2xxx)
  WALLET_NOT_CONNECTED = 2001,
  WALLET_USER_REJECTED = 2002,
  WALLET_INSUFFICIENT_FUNDS = 2003,
  WALLET_CHAIN_MISMATCH = 2004,
  
  // Contract Errors (3xxx)
  CONTRACT_EXECUTION_FAILED = 3001,
  CONTRACT_REVERT = 3002,
  CONTRACT_GAS_ESTIMATION_FAILED = 3003,
  CONTRACT_INVALID_ADDRESS = 3004,
  
  // Business Logic Errors (4xxx)
  AIRDROP_ALREADY_CLAIMED = 4001,
  AIRDROP_NOT_ELIGIBLE = 4002,
  HUMAN_VERIFICATION_FAILED = 4003,
  HUMAN_NOT_VERIFIED = 4004,
  
  // Validation Errors (5xxx)
  INVALID_ADDRESS = 5001,
  INVALID_INPUT = 5002,
  MISSING_REQUIRED_FIELD = 5003,
  
  // Unknown/System Errors (9xxx)
  UNKNOWN_ERROR = 9999,
}

/**
 * Error Severity Levels
 */
export enum ErrorSeverity {
  FATAL = 'fatal',     // Critical errors that block all functionality
  ERROR = 'error',     // Errors that prevent specific operations
  WARNING = 'warning', // Issues that may affect user experience
  INFO = 'info',       // Informational messages
}

/**
 * Error Categories for grouping
 */
export enum ErrorCategory {
  NETWORK = 'network',
  WALLET = 'wallet',
  CONTRACT = 'contract',
  BUSINESS = 'business',
  VALIDATION = 'validation',
  UNKNOWN = 'unknown',
}

/**
 * Structured Error Information
 */
export interface AppError {
  code: ErrorCode;
  category: ErrorCategory;
  severity: ErrorSeverity;
  message: string;           // Technical error message (for logging)
  userMessage: string;       // User-friendly message (for display)
  recoverable: boolean;      // Whether the error can be recovered from
  action?: string;           // Suggested user action
  originalError?: unknown;   // Original error object for debugging
}

/**
 * Error Message Templates
 * 
 * Maps error codes to user-friendly messages and recovery actions
 */
export const ERROR_MESSAGES: Record<ErrorCode, {
  userMessage: string;
  action?: string;
  severity: ErrorSeverity;
  recoverable: boolean;
}> = {
  // Network Errors
  [ErrorCode.NETWORK_CONNECTION_FAILED]: {
    userMessage: 'Unable to connect to the network. Please check your internet connection.',
    action: 'Check your connection and try again',
    severity: ErrorSeverity.ERROR,
    recoverable: true,
  },
  [ErrorCode.NETWORK_TIMEOUT]: {
    userMessage: 'The request timed out. The network might be slow or unavailable.',
    action: 'Wait a moment and try again',
    severity: ErrorSeverity.WARNING,
    recoverable: true,
  },
  [ErrorCode.RPC_ERROR]: {
    userMessage: 'Failed to communicate with the blockchain. Please try again.',
    action: 'Refresh the page or try again later',
    severity: ErrorSeverity.ERROR,
    recoverable: true,
  },
  
  // Wallet Errors
  [ErrorCode.WALLET_NOT_CONNECTED]: {
    userMessage: 'Please connect your wallet to continue.',
    action: 'Click the "Connect Wallet" button',
    severity: ErrorSeverity.INFO,
    recoverable: true,
  },
  [ErrorCode.WALLET_USER_REJECTED]: {
    userMessage: 'You rejected the transaction. No changes were made.',
    action: 'Try again if this was a mistake',
    severity: ErrorSeverity.INFO,
    recoverable: true,
  },
  [ErrorCode.WALLET_INSUFFICIENT_FUNDS]: {
    userMessage: 'Insufficient funds to complete the transaction.',
    action: 'Add more funds to your wallet',
    severity: ErrorSeverity.ERROR,
    recoverable: true,
  },
  [ErrorCode.WALLET_CHAIN_MISMATCH]: {
    userMessage: 'Please switch to the correct network in your wallet.',
    action: 'Switch to Humanity Testnet',
    severity: ErrorSeverity.WARNING,
    recoverable: true,
  },
  
  // Contract Errors
  [ErrorCode.CONTRACT_EXECUTION_FAILED]: {
    userMessage: 'The transaction failed. Please try again.',
    action: 'Check your wallet and try again',
    severity: ErrorSeverity.ERROR,
    recoverable: true,
  },
  [ErrorCode.CONTRACT_REVERT]: {
    userMessage: 'The transaction was declined. You may not meet the eligibility requirements.',
    action: 'Verify you have completed all steps and try again',
    severity: ErrorSeverity.ERROR,
    recoverable: true,
  },
  [ErrorCode.CONTRACT_GAS_ESTIMATION_FAILED]: {
    userMessage: 'We could not calculate the transaction fee at this moment.',
    action: 'Wait a moment and try again, or check your wallet balance',
    severity: ErrorSeverity.WARNING,
    recoverable: true,
  },
  [ErrorCode.CONTRACT_INVALID_ADDRESS]: {
    userMessage: 'We encountered a configuration issue. This is not your fault.',
    action: 'Please contact our support team for assistance',
    severity: ErrorSeverity.FATAL,
    recoverable: false,
  },
  
  // Business Logic Errors
  [ErrorCode.AIRDROP_ALREADY_CLAIMED]: {
    userMessage: 'You have already claimed this airdrop.',
    action: 'Check your wallet for the tokens',
    severity: ErrorSeverity.INFO,
    recoverable: false,
  },
  [ErrorCode.AIRDROP_NOT_ELIGIBLE]: {
    userMessage: 'You are not eligible for this airdrop.',
    action: 'Check the eligibility requirements',
    severity: ErrorSeverity.INFO,
    recoverable: false,
  },
  [ErrorCode.HUMAN_VERIFICATION_FAILED]: {
    userMessage: 'Human verification was not successful. Please try the verification process again.',
    action: 'Click "Verify Human" and follow the steps carefully',
    severity: ErrorSeverity.ERROR,
    recoverable: true,
  },
  [ErrorCode.HUMAN_NOT_VERIFIED]: {
    userMessage: 'Please complete human verification first.',
    action: 'Click "Verify Human" to continue',
    severity: ErrorSeverity.INFO,
    recoverable: true,
  },
  
  // Validation Errors
  [ErrorCode.INVALID_ADDRESS]: {
    userMessage: 'Invalid wallet address format.',
    action: 'Check the address and try again',
    severity: ErrorSeverity.ERROR,
    recoverable: true,
  },
  [ErrorCode.INVALID_INPUT]: {
    userMessage: 'Invalid input. Please check your entry.',
    action: 'Correct the input and try again',
    severity: ErrorSeverity.WARNING,
    recoverable: true,
  },
  [ErrorCode.MISSING_REQUIRED_FIELD]: {
    userMessage: 'Please fill in all required fields.',
    action: 'Complete the missing information',
    severity: ErrorSeverity.WARNING,
    recoverable: true,
  },
  
  // Unknown Errors
  [ErrorCode.UNKNOWN_ERROR]: {
    userMessage: 'An unexpected error occurred. Please try again.',
    action: 'Refresh the page or contact support',
    severity: ErrorSeverity.ERROR,
    recoverable: true,
  },
};

/**
 * Error Code to Category Mapping
 */
export function getErrorCategory(code: ErrorCode): ErrorCategory {
  if (code >= 1000 && code < 2000) return ErrorCategory.NETWORK;
  if (code >= 2000 && code < 3000) return ErrorCategory.WALLET;
  if (code >= 3000 && code < 4000) return ErrorCategory.CONTRACT;
  if (code >= 4000 && code < 5000) return ErrorCategory.BUSINESS;
  if (code >= 5000 && code < 6000) return ErrorCategory.VALIDATION;
  return ErrorCategory.UNKNOWN;
}
