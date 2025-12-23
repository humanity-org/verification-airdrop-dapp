import { create } from 'zustand';
import { AirdropStatus, VerificationStatus, type UserState, type LoadingState } from '../types/contracts';
import { useWalletStore } from './walletStore';
import { useToastStore } from './toastStore';
import { ErrorCode } from '../types/errors';
import { createAppError, handleError } from '../utils/errorHandler';
import { createAirdropService } from '../services/AirdropService';

/**
 * Airdrop Store - Airdrop business logic management
 * 
 * Responsibilities:
 * - Manage airdrop-related state (eligibility, claimed status, allocation amount, etc.)
 * - Handle airdrop verification and claim process
 * - Manage loading state and error messages
 * 
 * Dependencies:
 * - walletStore: Get wallet address and Web3 client
 * - toastStore: Display operation result notifications
 */
interface AirdropStore extends Omit<UserState, 'address'> {
  // Unified loading state management - use state machine instead of multiple boolean flags
  loadingState: LoadingState;

  // Status tracking
  claimStatusChecked: boolean;
  humanStatusChecked: boolean;

  // Actions
  checkClaimStatus: (showToast?: boolean) => Promise<void>;
  checkHumanStatus: (showToast?: boolean) => Promise<void>;
  verifyAll: () => Promise<void>;
  claimAirdrop: () => Promise<void>;
  resetError: () => void;
  resetAll: () => void;
}

export const useAirdropStore = create<AirdropStore>((set, get) => ({
  // Initial state
  status: AirdropStatus.DISCONNECTED,
  isClaimed: false,
  verificationStatus: VerificationStatus.None,
  allocation: '1',
  error: null,
  txHash: null,

  // Unified loading state
  loadingState: { type: 'idle' },

  claimStatusChecked: false,
  humanStatusChecked: false,

  /**
   * Check if the user has already claimed the airdrop
   *
   * @param showToast - Whether to show toast notification (default true)
   */
  checkClaimStatus: async (showToast = true) => {
    const { address, publicClient, walletClient } = useWalletStore.getState();

    if (!address) {
      const appError = createAppError(ErrorCode.WALLET_NOT_CONNECTED);
      handleError(appError, 'Check Claim Status');
      set({ error: appError.userMessage });
      return;
    }

    set({ loadingState: { type: 'checking_claim' }, error: null });

    const service = createAirdropService(address, publicClient, walletClient);
    const result = await service.checkClaimStatus();

    if (result.success) {
      const { isClaimed } = result.data;

      if (isClaimed) {
        set({
          status: AirdropStatus.ALREADY_CLAIMED,
          isClaimed,
          loadingState: { type: 'idle' },
          claimStatusChecked: true,
        });
        if (showToast) {
          useToastStore.getState().addToast({
            type: 'info',
            message: 'You have already claimed this airdrop',
          });
        }
      } else {
        set({
          status: AirdropStatus.READY_TO_CLAIM,
          isClaimed: false,
          loadingState: { type: 'idle' },
          claimStatusChecked: true,
        });
      }
    } else {
      handleError(result.error, 'Check Claim Status');
      set({
        status: AirdropStatus.ERROR,
        error: result.error.userMessage,
        loadingState: { type: 'idle' },
        claimStatusChecked: true,
      });
    }
  },

  /**
   * Check if the user has passed human verification
   *
   * @param showToast - Whether to show toast notification (default true)
   */
  checkHumanStatus: async (showToast = true) => {
    const { address, publicClient, walletClient } = useWalletStore.getState();

    if (!address) {
      const appError = createAppError(ErrorCode.WALLET_NOT_CONNECTED);
      handleError(appError, 'Check Human Status');
      set({ error: appError.userMessage });
      return;
    }

    set({ loadingState: { type: 'checking_human' }, error: null });

    const service = createAirdropService(address, publicClient, walletClient);
    const result = await service.checkHumanStatus();

    if (result.success) {
      const { verificationStatus } = result.data;

      // Save the complete verification status, different statuses have different meanings:
      // None: Not started verification
      // Pending: Verifying
      // Failed: Verification failed
      // Success: Verification successful
      set({
        status: AirdropStatus.READY_TO_CLAIM,
        verificationStatus,
        loadingState: { type: 'idle' },
        humanStatusChecked: true,
      });

      // Only show success toast when verification is successful
      if (verificationStatus === VerificationStatus.Success && showToast) {
        useToastStore.getState().addToast({
          type: 'success',
          message: 'Human verification passed! You are eligible for the airdrop.',
        });
      }
    } else {
      handleError(result.error, 'Check Human Status');
      set({
        status: AirdropStatus.ERROR,
        error: result.error.userMessage,
        loadingState: { type: 'idle' },
        humanStatusChecked: true,
      });
    }
  },

  /**
   * Verify all statuses (claim status and human verification)
   */
  verifyAll: async () => {
    const { address } = useWalletStore.getState();

    if (!address) {
      const appError = createAppError(ErrorCode.WALLET_NOT_CONNECTED);
      handleError(appError, 'Verify All');
      set({ error: appError.userMessage });
      return;
    }

    // Run both checks in parallel
    await Promise.all([get().checkHumanStatus(true)]);
  },

  /**
   * Claim the airdrop
   */
  claimAirdrop: async () => {
    const { address, publicClient, walletClient } = useWalletStore.getState();

    if (!address) {
      const appError = createAppError(ErrorCode.WALLET_NOT_CONNECTED);
      handleError(appError, 'Claim Airdrop');
      set({ error: appError.userMessage });
      return;
    }

    // Check if walletClient is available
    if (!walletClient) {
      const appError = createAppError(
        ErrorCode.WALLET_NOT_CONNECTED,
        new Error('Wallet is still initializing. Please wait a moment and try again.')
      );
      handleError(appError, 'Claim Airdrop');
      set({ error: 'Wallet is initializing. Please try again in a moment.' });
      return;
    }

    set({ loadingState: { type: 'claiming' }, error: null });

    const service = createAirdropService(address, publicClient, walletClient);
    const result = await service.claimAirdrop();

    if (result.success) {
      set({
        status: AirdropStatus.CLAIMED,
        isClaimed: true,
        loadingState: { type: 'idle' },
        txHash: result.data.txHash,
      });

      useToastStore.getState().addToast({
        type: 'success',
        message: 'Airdrop claimed successfully!',
      });
    } else {
      handleError(result.error, 'Claim Airdrop');
      set({
        status: AirdropStatus.ERROR,
        error: result.error.userMessage,
        loadingState: { type: 'idle' },
      });
    }
  },

  /**
   * Reset error state
   */
  resetError: () => {
    set({ error: null });
  },

  /**
   * Reset all airdrop state
   * 
   * Used to clean up state when wallet disconnects
   */
  resetAll: () => {
    set({
      status: AirdropStatus.DISCONNECTED,
      isClaimed: false,
      verificationStatus: VerificationStatus.None,
      allocation: '0',
      error: null,
      txHash: null,
      loadingState: { type: 'idle' },
      claimStatusChecked: false,
      humanStatusChecked: false,
    });
  },
}));
