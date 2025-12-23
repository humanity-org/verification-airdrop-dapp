import type { Address, PublicClient, WalletClient, Abi } from 'viem';
import { BaseContract } from './BaseContract';
import HUMANITY_ORACLE_ABI from '../abis/HumanityVerificationOracle.json';
import type { IHumanityVerificationOracleContract } from '../types/contracts';

/**
 * HumanityVerificationOracle contract implementation
 * Handles verification permission message generation
 */
export class HumanityVerificationOracleContract
  extends BaseContract
  implements IHumanityVerificationOracleContract
{
  constructor(
    address: Address,
    publicClient: PublicClient | null,
    walletClient: WalletClient | null,
  ) {
    super(address, HUMANITY_ORACLE_ABI as Abi, publicClient, walletClient);
  }

  /**
   * Get the permission message hash for verification
   * @param user - User address
   * @param dapp - DApp address
   * @param requiredClaims - Array of required claim types (e.g., ['is_human'])
   * @param maxAge - Maximum age of verification in seconds
   * @param callbackContract - Callback contract address
   * @returns Message hash to be signed
   */
  async getPermissionMessageHash(
    user: Address,
    dapp: Address,
    requiredClaims: string[],
    maxAge: bigint,
    callbackContract: Address,
  ): Promise<`0x${string}`> {
    return this.read<`0x${string}`>('getPermissionMessageHash', [
      user,
      dapp,
      requiredClaims,
      maxAge,
      callbackContract,
    ]);
  }
}
