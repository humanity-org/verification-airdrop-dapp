import { create } from 'zustand';
import type { Address, PublicClient, WalletClient } from 'viem';
import { AirdropStatus, type UserState, type ToastNotification } from '../types/contracts';
import { createAirdropContract } from '../contracts/factory';

interface AirdropStore extends UserState {
  // Clients
  publicClient: PublicClient | null;
  walletClient: WalletClient | null;

  // Independent loading states for each operation
  isCheckingClaim: boolean;
  isCheckingHuman: boolean;
  isVerifyingHuman: boolean;
  isClaiming: boolean;

  // Status tracking
  claimStatusChecked: boolean;
  humanStatusChecked: boolean;

  // Toast notifications
  toasts: ToastNotification[];

  // Actions
  setClients: (publicClient: PublicClient | null, walletClient: WalletClient | null) => void;
  connectWallet: (address: Address) => Promise<void>;
  disconnectWallet: () => void;
  checkClaimStatus: (showToast?: boolean) => Promise<void>;
  checkHumanStatus: (showToast?: boolean) => Promise<void>;
  verifyHuman: () => Promise<void>;
  verifyAll: () => Promise<void>;
  claimAirdrop: () => Promise<void>;
  addToast: (toast: Omit<ToastNotification, 'id'>) => void;
  removeToast: (id: string) => void;
  resetError: () => void;
}

export const useAirdropStore = create<AirdropStore>((set, get) => ({
  // Initial state
  address: null,
  status: AirdropStatus.DISCONNECTED,
  isClaimed: false,
  isHuman: false,
  allocation: '1',
  error: null,
  txHash: null,
  publicClient: null,
  walletClient: null,

  // Independent loading states
  isCheckingClaim: false,
  isCheckingHuman: false,
  isVerifyingHuman: false,
  isClaiming: false,

  claimStatusChecked: false,
  humanStatusChecked: false,
  toasts: [],

  // Set blockchain clients
  setClients: (publicClient, walletClient) => {
    set({ publicClient, walletClient });
  },

  // Connect wallet and start verification flow
  connectWallet: async (address: Address) => {
    set({
      address,
      status: AirdropStatus.CONNECTED,
      error: null,
      isCheckingClaim: false,
      isCheckingHuman: false,
      isVerifyingHuman: false,
      isClaiming: false,
      claimStatusChecked: false,
      humanStatusChecked: false,
    });

    // Automatically verify all statuses after connecting (silent mode - no toast)
    await Promise.all([
      get().checkClaimStatus(false),
      get().checkHumanStatus(false),
    ]);
  },

  // Disconnect wallet and reset state
  disconnectWallet: () => {
    set({
      address: null,
      status: AirdropStatus.DISCONNECTED,
      isClaimed: true,
      isHuman: false,
      allocation: '0',
      error: null,
      txHash: null,
      isCheckingClaim: false,
      isCheckingHuman: false,
      isVerifyingHuman: false,
      isClaiming: false,
      claimStatusChecked: false,
      humanStatusChecked: false,
    });
  },

  // Check if user has already claimed
  checkClaimStatus: async (showToast = true) => {
    const { address, publicClient, walletClient } = get();

    if (!address) {
      set({ error: 'No wallet connected' });
      return;
    }

    try {
      set({ isCheckingClaim: true, error: null });

      const airdropContract = createAirdropContract(publicClient, walletClient);
      const isClaimed = await airdropContract.isClaim(address);

      if (isClaimed??false) {
        set({
          status: AirdropStatus.ALREADY_CLAIMED,
          isClaimed,
          isCheckingClaim: false,
          claimStatusChecked: true,
        });
        if (showToast) {
          get().addToast({
            type: 'info',
            message: 'You have already claimed this airdrop',
          });
        }
      } else {
        set({
          isClaimed: false,
          isCheckingClaim: false,
          claimStatusChecked: true,
        });
      }
    } catch (error) {
      console.error('Error checking claim status:', error);
      set({
        status: AirdropStatus.ERROR,
        error: error instanceof Error ? error.message : 'Failed to check claim status',
        isCheckingClaim: false,
        claimStatusChecked: true,
      });
      if (showToast) {
        get().addToast({
          type: 'error',
          message: error instanceof Error ? error.message : 'Failed to check claim status',
        });
      }
    }
  },

  // Check if user passes human verification
  checkHumanStatus: async (showToast = true) => {
    const { address, publicClient, walletClient } = get();

    if (!address) {
      set({ error: 'No wallet connected' });
      return;
    }

    try {
      set({ isCheckingHuman: true, error: null });

      const airdropContract = createAirdropContract(publicClient, walletClient);
      const isHuman = await airdropContract.checkHuman(address);

      if (isHuman??false) {
        set({
          status: AirdropStatus.READY_TO_CLAIM,
          isHuman: true,
          isCheckingHuman: false,
          humanStatusChecked: true,
        });
        if (showToast) {
          get().addToast({
            type: 'success',
            message: 'Human verification passed! You are eligible for the airdrop.',
          });
        }
      } else {
        set({
          status: AirdropStatus.NOT_HUMAN,
          isHuman: false,
          isCheckingHuman: false,
          humanStatusChecked: true,
        });
        if (showToast) {
          get().addToast({
            type: 'error',
            message: 'Human verification failed. You are not eligible for this airdrop.',
          });
        }
      }
    } catch (error) {
      console.error('Error checking human verification:', error);
      set({
        status: AirdropStatus.ERROR,
        error: error instanceof Error ? error.message : 'Failed to check human verification',
        isCheckingHuman: false,
        humanStatusChecked: true,
      });
      if (showToast) {
        get().addToast({
          type: 'error',
          message: error instanceof Error ? error.message : 'Failed to check human verification',
        });
      }
    }
  },

  // Execute human verification transaction
  verifyHuman: async () => {
    const { address, publicClient, walletClient } = get();

    if (!address) {
      set({ error: 'No wallet connected' });
      return;
    }

    try {
      set({ isVerifyingHuman: true, error: null });

      const airdropContract = createAirdropContract(publicClient, walletClient);
      const txHash = await airdropContract.verifyHuman();

      set({
        status: AirdropStatus.READY_TO_CLAIM,
        isHuman: true,
        isVerifyingHuman: false,
        txHash,
      });

      get().addToast({
        type: 'success',
        message: 'Human verification successful! You are now eligible for the airdrop.',
      });
    } catch (error) {
      console.error('Error verifying human:', error);
      set({
        status: AirdropStatus.ERROR,
        error: error instanceof Error ? error.message : 'Failed to verify human',
        isVerifyingHuman: false,
      });
      get().addToast({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to verify human',
      });
    }
  },

  // Verify both claim status and human verification
  verifyAll: async () => {
    const { address } = get();

    if (!address) {
      set({ error: 'No wallet connected' });
      return;
    }

    try {
      // Run both checks in parallel
      await Promise.all([
        get().checkHumanStatus(true),
      ]);
    } catch (error) {
      console.error('Error during verification:', error);
      set({
        status: AirdropStatus.ERROR,
        error: error instanceof Error ? error.message : 'Verification failed',
      });
      get().addToast({
        type: 'error',
        message: error instanceof Error ? error.message : 'Verification failed',
      });
    }
  },

  // Claim the airdrop
  claimAirdrop: async () => {
    const { address, publicClient, walletClient, isHuman } = get();

    if (!address) {
      set({ error: 'No wallet connected' });
      return;
    }

    if (!isHuman) {
      set({ error: 'Human verification failed' });
      get().addToast({
        type: 'error',
        message: 'Please complete human verification first',
      });
      return;
    }

    try {
      set({ isClaiming: true, error: null });

      const airdropContract = createAirdropContract(publicClient, walletClient);
      const txHash = await airdropContract.claim();

      set({
        status: AirdropStatus.CLAIMED,
        isClaimed: true,
        isClaiming: false,
        txHash,
      });

      get().addToast({
        type: 'success',
        message: 'Airdrop claimed successfully!',
      });
    } catch (error) {
      console.error('Error claiming airdrop:', error);
      set({
        status: AirdropStatus.ERROR,
        error: error instanceof Error ? error.message : 'Failed to claim airdrop',
        isClaiming: false,
      });
      get().addToast({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to claim airdrop',
      });
    }
  },

  // Add toast notification
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastNotification = { id, ...toast };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    // Auto-remove toast after duration
    const duration = toast.duration || 5000;
    setTimeout(() => {
      get().removeToast(id);
    }, duration);
  },

  // Remove toast notification
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  // Reset error state
  resetError: () => {
    set({ error: null });
  },
}));
