import { create } from 'zustand';
import type { Address, PublicClient, WalletClient } from 'viem';

/**
 * Wallet Store - Wallet connection and Web3 client management
 * 
 * Responsibilities:
 * - Manage wallet connection state (address, connection status)
 * - Manage Web3 clients (PublicClient for reading, WalletClient for writing)
 * - Handle wallet connection and disconnection
 */
interface WalletStore {
  // State
  address: Address | null;
  isConnected: boolean;
  publicClient: PublicClient | null;
  walletClient: WalletClient | null;

  // Actions
  setClients: (publicClient: PublicClient | null, walletClient: WalletClient | null) => void;
  setAddress: (address: Address | null) => void;
  connect: (address: Address) => void;
  disconnect: () => void;
}

export const useWalletStore = create<WalletStore>((set) => ({
  // Initial state
  address: null,
  isConnected: false,
  publicClient: null,
  walletClient: null,

  /**
   * Set Web3 clients
   * 
   * PublicClient is used for reading blockchain data (no signature required)
   * WalletClient is used for sending transactions (signature required)
   */
  setClients: (publicClient, walletClient) => {
    set({ publicClient, walletClient });
  },

  /**
   * Set wallet address
   */
  setAddress: (address) => {
    set({
      address,
      isConnected: address !== null,
    });
  },

  /**
   * Connect wallet
   * 
   * Set address and mark as connected
   */
  connect: (address) => {
    set({
      address,
      isConnected: true,
    });
  },

  /**
   * Disconnect wallet
   * 
   * Clear address and reset connection state
   */
  disconnect: () => {
    set({
      address: null,
      isConnected: false,
    });
  },
}));
