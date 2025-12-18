import type { Address } from 'viem';

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
 * User state interface
 */
export interface UserState {
  address: Address | null;
  status: AirdropStatus;
  isClaimed: boolean;
  isHuman: boolean;
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
  write(functionName: string, args?: unknown[]): Promise<string>;
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
 * Airdrop contract interface
 */
export interface IAirdropContract extends IContract {
  isClaim(address: Address): Promise<boolean>;
  checkHuman(address: Address): Promise<boolean>;
  verifyHuman(): Promise<string>;
  claim(): Promise<string>;
  getAllocation(address: Address): Promise<bigint>;
}
