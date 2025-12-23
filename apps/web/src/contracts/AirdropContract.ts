import type { Address, PublicClient, WalletClient, Abi } from 'viem';
import { BaseContract } from './BaseContract';
import type { IAirdropContract } from '../types/contracts';
import { VerificationStatus } from '../types/contracts';
import AirdropAbi from '../abis/Airdrop.json';

/**
 * Airdrop contract implementation
 */
export class AirdropContract extends BaseContract implements IAirdropContract {
  constructor(address: Address, publicClient: PublicClient | null, walletClient: WalletClient | null) {
    super(address, AirdropAbi as Abi, publicClient, walletClient);
  }

  /**
   * Check if an address has already claimed the airdrop
   * @param address - User address to check
   * @returns True if the address has claimed, false otherwise
   */
  async hasClaimed(address: Address): Promise<boolean> {
    return this.read<boolean>('hasClaimed', [address]);
  }

  /**
   * Check if an address is verified as human
   * @param address - User address to check
   * @returns True if verified as human, false otherwise
   */
  async checkHuman(address: Address): Promise<boolean> {
    return this.read<boolean>('isHuman', [address]);
  }

  /**
   * Get the permission message hash for airdrop claim
   * @param userAddress - User address to get message hash for
   * @returns Message hash to be signed
   */
  async getPermissionMessageHashForAirdrop(userAddress: Address): Promise<string> {
    const hash = await this.read<string>('getPermissionMessageHashForAirdrop', [userAddress]);
    return hash;
  }

  /**
   * Execute airdrop claim (includes human verification)
   * This is an asynchronous operation, need to poll result via getVerificationStatus
   * @param userSignature - User's signature for the claim permission
   * @param gasLimit - Optional gas limit (defaults to 800,000 for safety)
   * @returns Transaction hash
   */
  async claimAirdrop(userSignature: `0x${string}`, gasLimit?: bigint): Promise<string> {
    // Default to larger gas limit (800,000), can manually specify higher value
    const gas = gasLimit ?? BigInt(800000);
    return this.write('claimAirdrop', [userSignature], gas);
  }

  /**
   * Get the verification status of an address
   * @param address - User address
   * @returns VerificationStatus enum value
   */
  async getVerificationStatus(address: Address): Promise<VerificationStatus> {
    const status = await this.read<number>('getVerificationStatus', [address]);
    return status as VerificationStatus;
  }

  /**
   * Get the airdrop allocation for an address
   * @param address - User address
   * @returns Allocation amount in wei
   */
  async getAllocation(address: Address): Promise<bigint> {
    return this.read<bigint>('getAllocation', [address]);
  }

  /**
   * Get the HumanityVerificationOracle contract address
   * @returns Oracle contract address
   */
  async humanityOracle(): Promise<Address> {
    return this.read<Address>('humanityOracle', []);
  }

  /**
   * Get the maximum verification age in seconds
   * @returns Maximum verification age (uint256)
   */
  async getMaxVerificationAge(): Promise<bigint> {
    return this.read<bigint>('MAX_VERIFICATION_AGE', []);
  }

  /**
   * Get all required claims for airdrop verification
   * Reads the REQUIRED_CLAIMS array from the contract
   * @returns Array of required claim strings (e.g., ['is_human'])
   */
  async getRequiredClaims(): Promise<string[]> {
    const claims: string[] = [];
    let index = 0;
    const MAX_CLAIMS = 10; // Safety limit to prevent infinite loop
    
    try {
      // Read REQUIRED_CLAIMS array elements until we get an empty string or error
      while (index < MAX_CLAIMS) {
        const claim = await this.read<string>('REQUIRED_CLAIMS', [BigInt(index)]);
        
        // Stop if we get an empty string
        if (!claim || claim.trim() === '') {
          break;
        }
        
        claims.push(claim);
        index++;
      }
    } catch (error) {
      // If we get an error (e.g., array out of bounds), stop reading
      // This is expected behavior when we reach the end of the array
      // eslint-disable-next-line no-console
      console.log(`Finished reading ${index} required claims`);
    }
    
    return claims;
  }
}
