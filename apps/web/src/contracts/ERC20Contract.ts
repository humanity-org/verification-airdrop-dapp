import type { Address, PublicClient, WalletClient, Abi } from 'viem';
import { BaseContract } from './BaseContract';
import type { IERC20Contract } from '../types/contracts';
import ERC20Abi from '../abis/ERC20.json';

/**
 * ERC20 token contract implementation
 */
export class ERC20Contract extends BaseContract implements IERC20Contract {
  constructor(address: Address, publicClient: PublicClient | null, walletClient: WalletClient | null) {
    super(address, ERC20Abi as Abi, publicClient, walletClient);
  }

  async balanceOf(address: Address): Promise<bigint> {
    return this.read<bigint>('balanceOf', [address]);
  }

  async symbol(): Promise<string> {
    return this.read<string>('symbol');
  }

  async decimals(): Promise<number> {
    return this.read<number>('decimals');
  }

  async totalSupply(): Promise<bigint> {
    return this.read<bigint>('totalSupply');
  }
}
