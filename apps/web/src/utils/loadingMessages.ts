import type { LoadingState } from '../types/contracts';

/**
 * Loading Message Mapping
 *
 * Provides user-friendly, descriptive messages for each loading state.
 * Messages follow the pattern: [Action] + [Context]
 */
export const LOADING_MESSAGES: Record<
  Exclude<LoadingState['type'], 'idle'>,
  string
> = {
  checking_claim: 'Checking your claim status...',
  checking_human: 'Verifying your eligibility...',
  verifying_human: 'Submitting verification to the blockchain...',
  claiming: 'Processing your airdrop claim...',
};

/**
 * Get user-friendly loading message
 *
 * @param loadingState - Current loading state
 * @returns Descriptive message or null if idle
 */
export function getLoadingMessage(loadingState: LoadingState): string | null {
  if (loadingState.type === 'idle') return null;
  return LOADING_MESSAGES[loadingState.type];
}
