import { create } from 'zustand';
import { type Address } from 'viem';
import { createERC20Contract } from '../contracts/factory';
import { useWalletStore } from './walletStore';
import { CONTRACT_ADDRESSES } from '../contracts/factory';
import { formatUnits } from 'viem';

/**
 * Token Store - Token balance and information management
 * 
 * Responsibilities:
 * - Fetch and manage user token balance
 * - Get token metadata (symbol, decimals)
 * - Format balance display
 * 
 * Dependencies:
 * - walletStore: Get Web3 client
 */
interface TokenStore {
  // Token information
  balance: string; // Formatted balance string
  rawBalance: bigint | null; // Raw balance (wei)
  symbol: string;
  decimals: number;
  
  // Loading state
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchBalance: (address: Address) => Promise<void>;
  fetchTokenInfo: () => Promise<void>;
  reset: () => void;
}

const INITIAL_STATE = {
  balance: '0',
  rawBalance: null,
  symbol: 'DEMO',
  decimals: 18,
  isLoading: false,
  error: null,
};

export const useTokenStore = create<TokenStore>((set, get) => ({
  ...INITIAL_STATE,

  /**
   * Fetch user's token balance
   */
  fetchBalance: async (address: Address) => {
    const { publicClient, walletClient } = useWalletStore.getState();

    if (!address || !publicClient) {
      set({ error: 'Wallet not connected' });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const contract = createERC20Contract(
        CONTRACT_ADDRESSES.TOKEN,
        publicClient,
        walletClient
      );

      const rawBalance = await contract.balanceOf(address);
      const { decimals } = get();
      
      // Format balance - remove trailing zeros
      const formattedBalance = formatUnits(rawBalance, decimals);
      const balanceNumber = parseFloat(formattedBalance);
      
      // Format display:
      // - If balance >= 1B, display as "X.XXB"
      // - If balance >= 1M, display as "X.XXM"
      // - If balance >= 1K, display as "X.XXK"
      // - Otherwise display full number, max 2 decimal places
      let displayBalance: string;
      
      if (balanceNumber >= 1_000_000_000) {
        displayBalance = (balanceNumber / 1_000_000_000).toFixed(2) + 'B';
      } else if (balanceNumber >= 1_000_000) {
        displayBalance = (balanceNumber / 1_000_000).toFixed(2) + 'M';
      } else if (balanceNumber >= 1_000) {
        displayBalance = (balanceNumber / 1_000).toFixed(2) + 'K';
      } else {
        displayBalance = balanceNumber.toFixed(2);
      }

      set({
        balance: displayBalance,
        rawBalance,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to fetch token balance:', error);
      set({
        error: 'Failed to fetch balance',
        isLoading: false,
      });
    }
  },

  /**
   * Fetch token's basic information (symbol, decimals)
   */
  fetchTokenInfo: async () => {
    const { publicClient, walletClient } = useWalletStore.getState();

    if (!publicClient) {
      return;
    }

    try {
      const contract = createERC20Contract(
        CONTRACT_ADDRESSES.TOKEN,
        publicClient,
        walletClient
      );

      const [symbol, decimals] = await Promise.all([
        contract.symbol(),
        contract.decimals(),
      ]);

      set({ symbol, decimals });
    } catch (error) {
      console.error('Failed to fetch token info:', error);
      // Use default values, don't set error as this is not a critical error
    }
  },

  /**
   * Reset token state
   */
  reset: () => {
    set(INITIAL_STATE);
  },
}));
