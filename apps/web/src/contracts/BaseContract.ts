import type { Address, PublicClient, WalletClient, Abi } from 'viem';
import type { IContract } from '../types/contracts';

/**
 * Base contract class providing read and write functionality
 */
export abstract class BaseContract implements IContract {
  public readonly address: Address;
  protected readonly abi: Abi;
  protected readonly publicClient: PublicClient | null;
  protected readonly walletClient: WalletClient | null;

  constructor(
    address: Address,
    abi: Abi,
    publicClient: PublicClient | null,
    walletClient: WalletClient | null,
  ) {
    this.address = address;
    this.abi = abi;
    this.publicClient = publicClient;
    this.walletClient = walletClient;
  }

  /**
   * Read from contract
   */
  async read<T>(functionName: string, args: unknown[] = []): Promise<T> {
    if (!this.publicClient) {
      throw new Error('Public client is not available');
    }

    return (await this.publicClient.readContract({
      address: this.address,
      abi: this.abi,
      functionName,
      args,
    })) as T;
  }

  /**
   * Write to contract
   */
  async write(functionName: string, args: unknown[] = []): Promise<string> {
    if (!this.walletClient) {
      throw new Error('Wallet client is not available');
    }

    const account = this.walletClient.account;
    if (!account) {
      throw new Error('No account connected');
    }

    const hash = await this.walletClient.writeContract({
      address: this.address,
      abi: this.abi,
      functionName,
      args,
      account,
      chain: this.walletClient.chain ?? null,
    });

    return hash;
  }
}
