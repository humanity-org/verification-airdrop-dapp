import type { Address, PublicClient, WalletClient, Abi } from 'viem';
import { BaseContract } from './BaseContract';
import type { IAirdropContract } from '../types/contracts';
import AirdropAbi from '../abis/Airdrop.json';

/**
 * Airdrop contract implementation
 */
export class AirdropContract extends BaseContract implements IAirdropContract {
  constructor(address: Address, publicClient: PublicClient | null, walletClient: WalletClient | null) {
    super(address, AirdropAbi as Abi, publicClient, walletClient);
  }

  async isClaim(address: Address): Promise<boolean> {
    return this.read<boolean>('isClaim', [address]);
  }

  async checkHuman(address: Address): Promise<boolean> {
    return this.read<boolean>('isHuman', [address]);
  }

  async verifyHuman(): Promise<string> {
    return this.write('verifyHuman');
  }

  async claim(): Promise<string> {
    return this.write('claim');
  }

  async getAllocation(address: Address): Promise<bigint> {
    return this.read<bigint>('getAllocation', [address]);
  }
}
