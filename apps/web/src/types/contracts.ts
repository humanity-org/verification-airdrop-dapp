import type { Address } from 'viem';

/**
 * Verification status enum
 * Corresponds to the VerificationStatus in the smart contract
 */
export enum VerificationStatus {
  None = 0,     // Not started
  Pending = 1,  // Processing
  Failed = 2,   // Failed
  Success = 3   // Success
}

/**
 * Airdrop status enum representing the state machine flow
 */
export enum AirdropStatus {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  CHECKING_CLAIM = 'CHECKING_CLAIM',
  CHECKING_HUMAN = 'CHECKING_HUMAN',
  NOT_HUMAN = 'NOT_HUMAN',
  ALREADY_CLAIMED = 'ALREADY_CLAIMED',
  READY_TO_CLAIM = 'READY_TO_CLAIM',
  CLAIMING = 'CLAIMING',
  CLAIMED = 'CLAIMED',
  ERROR = 'ERROR',
}

/**
 * Loading state type - Unified loading state management
 * Uses state machine pattern to replace multiple boolean flags
 */
export type LoadingState =
  | { type: 'idle' }
  | { type: 'checking_claim' }
  | { type: 'checking_human' }
  | { type: 'verifying_human' }
  | { type: 'claiming' };

/**
 * User state interface
 */
export interface UserState {
  address: Address | null;
  status: AirdropStatus;
  isClaimed: boolean;
  verificationStatus: VerificationStatus;
  allocation: string;
  error: string | null;
  txHash: string | null;
}

/**
 * Toast notification interface
 */
export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  txHash?: string;
  duration?: number;
}

/**
 * Base contract interface
 */
export interface IContract {
  address: Address;
  read<T>(functionName: string, args?: unknown[]): Promise<T>;
  write(functionName: string, args?: unknown[], gasLimit?: bigint): Promise<string>;
}

/**
 * ERC20 token contract interface
 */
export interface IERC20Contract extends IContract {
  balanceOf(address: Address): Promise<bigint>;
  symbol(): Promise<string>;
  decimals(): Promise<number>;
  totalSupply(): Promise<bigint>;
}

/**
 * HumanityVerificationOracle contract interface
 */
export interface IHumanityVerificationOracleContract extends IContract {
  /**
   * Get the permission message hash for verification
   * @param user - User address
   * @param dapp - DApp address
   * @param requiredClaims - Array of required claim types (e.g., ['is_human'])
   * @param maxAge - Maximum age of verification in seconds
   * @param callbackContract - Callback contract address
   * @returns Message hash to be signed
   */
  getPermissionMessageHash(
    user: Address,
    dapp: Address,
    requiredClaims: string[],
    maxAge: bigint,
    callbackContract: Address
  ): Promise<`0x${string}`>;
}

/**
 * Airdrop contract interface
 */
export interface IAirdropContract extends IContract {
  /**
   * Check if an address has already claimed the airdrop
   * @param address - User address to check
   * @returns True if the address has claimed, false otherwise
   */
  hasClaimed(address: Address): Promise<boolean>;

  /**
   * Check if an address is verified as human
   * @param address - User address to check
   * @returns True if verified as human, false otherwise
   */
  checkHuman(address: Address): Promise<boolean>;

  /**
   * Get the permission message hash for airdrop claim
   * @param userAddress - User address to get message hash for
   * @returns Message hash to be signed
   */
  getPermissionMessageHashForAirdrop(userAddress: Address): Promise<string>;

  /**
   * Execute airdrop claim (includes human verification)
   * This is an asynchronous operation, need to poll result via getVerificationStatus
   * @param userSignature - User's signature for the claim permission
   * @param gasLimit - Optional gas limit (defaults to 800,000 for safety)
   * @returns Transaction hash
   */
  claimAirdrop(userSignature: `0x${string}`, gasLimit?: bigint): Promise<string>;

  /**
   * Get the verification status of an address
   * @param address - User address
   * @returns VerificationStatus enum value
   */
  getVerificationStatus(address: Address): Promise<VerificationStatus>;

  /**
   * Get the airdrop allocation for an address
   * @param address - User address
   * @returns Allocation amount in wei
   */
  getAllocation(address: Address): Promise<bigint>;

  /**
   * Get the HumanityVerificationOracle contract address
   * @returns Oracle contract address
   */
  humanityOracle(): Promise<Address>;

  /**
   * Get the maximum verification age in seconds
   * @returns Maximum verification age (uint256)
   */
  getMaxVerificationAge(): Promise<bigint>;

  /**
   * Get all required claims for airdrop verification
   * @returns Array of required claim strings (e.g., ['is_human'])
   */
  getRequiredClaims(): Promise<string[]>;
}
