import type { Address, PublicClient, WalletClient } from 'viem';
import { AirdropContract } from './AirdropContract';
import { ERC20Contract } from './ERC20Contract';
import { MockAirdropContract } from './mock/MockAirdropContract';
import type { IAirdropContract, IERC20Contract } from '../types/contracts';

/**
 * Contract addresses from environment variables
 */
export const CONTRACT_ADDRESSES = {
  TOKEN: (import.meta.env.VITE_TOKEN_ADDRESS || '0x0000000000000000000000000000000000000000') as Address,
  AIRDROP: (import.meta.env.VITE_AIRDROP_ADDRESS || '0x0000000000000000000000000000000000000001') as Address,
};

/**
 * Check if we're in mock mode
 */
export function isMockMode(): boolean {
  return import.meta.env.VITE_MOCK_MODE === 'true';
}

/**
 * Create airdrop contract instance
 * Returns MockAirdropContract in mock mode, otherwise real AirdropContract
 */
export function createAirdropContract(
  publicClient: PublicClient | null,
  walletClient: WalletClient | null,
): IAirdropContract {
  if (isMockMode()) {
    return new MockAirdropContract(CONTRACT_ADDRESSES.AIRDROP);
  }

  return new AirdropContract(CONTRACT_ADDRESSES.AIRDROP, publicClient, walletClient);
}

/**
 * Create ERC20 token contract instance
 */
export function createERC20Contract(
  address: Address,
  publicClient: PublicClient | null,
  walletClient: WalletClient | null,
): IERC20Contract {
  return new ERC20Contract(address, publicClient, walletClient);
}
