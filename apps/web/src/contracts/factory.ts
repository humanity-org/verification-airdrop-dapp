import type { Address, PublicClient, WalletClient } from 'viem';
import { AirdropContract } from './AirdropContract';
import { ERC20Contract } from './ERC20Contract';
import type { IAirdropContract, IERC20Contract } from '../types/contracts';

/**
 * Contract addresses from environment variables
 */
export const CONTRACT_ADDRESSES = {
  TOKEN: (import.meta.env.VITE_TOKEN_ADDRESS || '0x0000000000000000000000000000000000000000') as Address,
  AIRDROP: (import.meta.env.VITE_AIRDROP_ADDRESS || '0x0000000000000000000000000000000000000001') as Address,
};

/**
 * Create airdrop contract instance
 */
export function createAirdropContract(
  publicClient: PublicClient | null,
  walletClient: WalletClient | null,
): IAirdropContract {
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
