import type { Address, PublicClient, WalletClient } from 'viem';
import { recoverMessageAddress } from 'viem';
import { createAirdropContract } from '../contracts/factory';
import type { IAirdropContract } from '../types/contracts';
import { VerificationStatus } from '../types/contracts';
import { ErrorCode, type AppError } from '../types/errors';
import { createAppError, parseContractError } from '../utils/errorHandler';
import { HumanityVerificationOracleContract } from '../contracts/HumanityVerificationOracleContract';

/**
 * Service layer return result type
 * Use discriminated union to ensure type safety
 */
export type ServiceResult<T> =
  | { success: true; data: T }
  | { success: false; error: AppError };

/**
 * Result for checking claim status
 */
export interface CheckClaimStatusResult {
  isClaimed: boolean;
}

/**
 * Result for checking human verification status
 */
export interface CheckHumanStatusResult {
  verificationStatus: VerificationStatus;
}

/**
 * Result for getting verification status
 */
export interface GetVerificationStatusResult {
  status: VerificationStatus;
}

/**
 * Result for claiming airdrop
 */
export interface ClaimAirdropResult {
  txHash: string;
  verificationStatus: VerificationStatus;
}

/**
 * AirdropService - Airdrop business logic service layer
 *
 * Responsibilities:
 * - Encapsulate contract interaction logic
 * - Handle business validation
 * - Return structured results (success/failure)
 *
 * Not responsible for:
 * - State management (handled by Store)
 * - UI notifications (handled by Store)
 * - Error display (Store calls errorHandler)
 */
export class AirdropService {
  private airdropContract: IAirdropContract;
  private address: Address;
  private publicClient: PublicClient | null;
  private walletClient: WalletClient | null;

  /**
   * Constructor - Dependency injection pattern
   *
   * @param address - User wallet address
   * @param publicClient - Public client (read-only operations)
   * @param walletClient - Wallet client (write operations)
   */
  constructor(
    address: Address,
    publicClient: PublicClient | null,
    walletClient: WalletClient | null
  ) {
    this.address = address;
    this.publicClient = publicClient;
    this.walletClient = walletClient;
    this.airdropContract = createAirdropContract(publicClient, walletClient);
  }

  /**
   * Check if the user has already claimed the airdrop
   *
   * @returns ServiceResult<CheckClaimStatusResult>
   */
  async checkClaimStatus(): Promise<ServiceResult<CheckClaimStatusResult>> {
    try {
      const isClaimed = await this.airdropContract.hasClaimed(this.address);

      return {
        success: true,
        data: {
          isClaimed: isClaimed ?? false,
        },
      };
    } catch (error) {
      const errorCode = parseContractError(error);
      const appError = createAppError(errorCode, error);

      return {
        success: false,
        error: appError,
      };
    }
  }

  /**
   * Check the user's human verification status
   *
   * Returns the complete VerificationStatus enum value:
   * - None (0): Verification not started
   * - Pending (1): Verification in progress
   * - Failed (2): Verification failed
   * - Success (3): Verification successful
   *
   * @returns ServiceResult<CheckHumanStatusResult>
   */
  async checkHumanStatus(): Promise<ServiceResult<CheckHumanStatusResult>> {
    try {
      const verificationStatus = await this.airdropContract.getVerificationStatus(this.address);

      return {
        success: true,
        data: {
          verificationStatus,
        },
      };
    } catch (error) {
      const errorCode = parseContractError(error);
      const appError = createAppError(errorCode, error);

      return {
        success: false,
        error: appError,
      };
    }
  }

  /**
   * Claim airdrop (includes human verification)
   *
   * Prerequisites:
   * - User has not claimed the airdrop before
   *
   * Process description:
   * 1. Get signature message hash
   * 2. User signs the message
   * 3. Call the contract's claimAirdrop method to initiate claim
   * 4. Automatically poll verification status until completion or timeout
   * 5. Return result based on final verification status
   *
   * @returns ServiceResult<ClaimAirdropResult> - Contains transaction hash and verification status
   *
   * @remarks
   * - Verification process may take up to 2 minutes
   * - Verification failure or timeout will return an error
   * - Returns VerificationStatus.Success on success
   */
  async claimAirdrop(): Promise<ServiceResult<ClaimAirdropResult>> {
    try {
      // 1. Get HumanityVerificationOracle contract address
      const oracleAddress = await this.airdropContract.humanityOracle();

      // 2. Create HumanityVerificationOracle contract instance
      const oracleContract = new HumanityVerificationOracleContract(
        oracleAddress,
        this.publicClient,
        this.walletClient
      );

      // 3. Get permission message hash
      const airdropAddress = this.airdropContract.address;

      // Read REQUIRED_CLAIMS and MAX_VERIFICATION_AGE from Airdrop contract
      const requiredClaims = await this.airdropContract.getRequiredClaims();
      const maxAge = await this.airdropContract.getMaxVerificationAge();
      const messageHash = await oracleContract.getPermissionMessageHash(
        this.address,
        airdropAddress,
        requiredClaims,
        maxAge,
        airdropAddress
      );
      console.log(  this.address,
        airdropAddress,
        requiredClaims,
        maxAge,
        airdropAddress)

      // 4. Use wallet to sign the message
      if (!this.walletClient) {
        throw new Error('Wallet client is not available');
      }

      // 🔴 Pre-signature verification: Ensure walletClient account matches current address
      if (!this.walletClient.account) {
        throw new Error('Wallet account is not available');
      }

      if (this.walletClient.account.address.toLowerCase() !== this.address.toLowerCase()) {
        throw new Error(
          `Wallet account mismatch!\n` +
          `Connected address: ${this.address}\n` +
          `Active wallet: ${this.walletClient.account.address}\n` +
          `Please reconnect with the correct wallet.`
        );
      }

      console.log('=== Signature Debug Info ===');
      console.log('User Address:', this.address);
      console.log('Wallet Account:', this.walletClient.account.address);
      console.log('Message Hash:', messageHash);

      const signature = await this.walletClient.signMessage({
        message: { raw: messageHash },
        account: this.address,
      });

      console.log('Signature:', signature);

      // 🔴 Post-signature verification: Ensure signature can recover the correct address
      try {
        const recoveredAddress = await recoverMessageAddress({
          message: { raw: messageHash },
          signature,
        });

        console.log('Recovered Address:', recoveredAddress);
        console.log('Expected Address:', this.address);
        console.log('Match:', recoveredAddress.toLowerCase() === this.address.toLowerCase());

        if (recoveredAddress.toLowerCase() !== this.address.toLowerCase()) {
          throw new Error(
            `Signature verification failed!\n\n` +
            `Expected signer: ${this.address}\n` +
            `Recovered signer: ${recoveredAddress}\n\n` +
            `This indicates a signing format mismatch with the Oracle contract.\n` +
            `The signature cannot be verified correctly.\n\n` +
            `Possible causes:\n` +
            `- Frontend uses EIP-191 (signMessage) but contract expects raw signature\n` +
            `- Contract expects EIP-712 (signTypedData) instead\n` +
            `- Message hash construction mismatch\n\n` +
            `Please contact the development team to verify the contract's signature format.`
          );
        }

        console.log('✅ Signature verification passed!');
      } catch (error) {
        if (error instanceof Error && error.message.includes('Signature verification failed')) {
          throw error; // Re-throw our custom error
        }
        // Also report other errors
        throw new Error(
          `Failed to verify signature: ${error instanceof Error ? error.message : 'Unknown error'}\n` +
          `This may indicate a technical issue with the signature recovery process.`
        );
      }

      // 5. Call contract's claimAirdrop method, passing in the real signature
      // 🔴 Manually set a larger gas limit (1,000,000) to ensure transaction success
      const txHash = await this.airdropContract.claimAirdrop(signature, BigInt(1000000));

      // 6. Poll verification status
      const verificationStatus = await this.pollVerificationStatus();

      // 7. Return result based on final status
      if (verificationStatus === VerificationStatus.Success) {
        // Verification successful
        return {
          success: true,
          data: {
            txHash,
            verificationStatus,
          },
        };
      } else {
        // Verification failed or timed out
        // Use HUMAN_VERIFICATION_FAILED for failed status
        // Use NETWORK_TIMEOUT for timeout or incomplete status
        const errorCode = verificationStatus === VerificationStatus.Failed
          ? ErrorCode.HUMAN_VERIFICATION_FAILED
          : ErrorCode.NETWORK_TIMEOUT;
        const errorMessage = verificationStatus === VerificationStatus.Failed
          ? 'Human verification failed. Please try again.'
          : 'Verification timed out. Please check your status later.';
        const appError = createAppError(errorCode, new Error(errorMessage));

        return {
          success: false,
          error: appError,
        };
      }
    } catch (error) {
      // Contract call failed
      const errorCode = parseContractError(error);
      const appError = createAppError(errorCode, error);

      return {
        success: false,
        error: appError,
      };
    }
  }

  /**
   * Get user's verification status
   *
   * @returns ServiceResult<GetVerificationStatusResult>
   */
  async getVerificationStatus(): Promise<ServiceResult<GetVerificationStatusResult>> {
    try {
      const status = await this.airdropContract.getVerificationStatus(this.address);

      return {
        success: true,
        data: {
          status,
        },
      };
    } catch (error) {
      const errorCode = parseContractError(error);
      const appError = createAppError(errorCode, error);

      return {
        success: false,
        error: appError,
      };
    }
  }

  /**
   * Get user's airdrop allocation amount
   *
   * @returns ServiceResult<bigint>
   */
  async getAllocation(): Promise<ServiceResult<bigint>> {
    try {
      const allocation = await this.airdropContract.getAllocation(this.address);

      return {
        success: true,
        data: allocation,
      };
    } catch (error) {
      const errorCode = parseContractError(error);
      const appError = createAppError(errorCode, error);

      return {
        success: false,
        error: appError,
      };
    }
  }

  /**
   * Poll verification status until status is no longer Pending
   *
   * @param maxAttempts - Maximum polling attempts, default 60 times
   * @param intervalMs - Polling interval (milliseconds), default 2000ms (2 seconds)
   * @returns Final verification status
   * @private
   *
   * @remarks
   * - Total timeout is approximately maxAttempts * intervalMs (default ~2 minutes)
   * - Single polling failure will not interrupt, will continue to next poll
   * - Returns VerificationStatus.None after timeout
   */
  private async pollVerificationStatus(
    maxAttempts: number = 60,
    intervalMs: number = 2000
  ): Promise<VerificationStatus> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const status = await this.airdropContract.getVerificationStatus(this.address);
        console.log('status', status)
        // If status is not Pending, return result
        if (status !== VerificationStatus.Pending) {
          return status;
        }

        // Wait for specified time before continuing poll (no need to wait on last attempt)
        if (attempt < maxAttempts - 1) {
          await this.sleep(intervalMs);
        }
      } catch (error) {
        // Single poll failure does not interrupt, log and continue
        console.error(`Polling attempt ${attempt + 1}/${maxAttempts} failed:`, error);

        // If not the last attempt, wait and continue
        if (attempt < maxAttempts - 1) {
          await this.sleep(intervalMs);
        }
      }
    }

    // Timeout, return None to indicate verification incomplete
    console.warn(`Verification status polling timed out after ${maxAttempts} attempts`);
    return VerificationStatus.None;
  }

  /**
   * Sleep for specified milliseconds
   *
   * @param ms - Milliseconds
   * @returns Promise<void>
   * @private
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Service factory function
 *
 * @param address - User wallet address
 * @param publicClient - Public client
 * @param walletClient - Wallet client
 * @returns AirdropService instance
 */
export function createAirdropService(
  address: Address,
  publicClient: PublicClient | null,
  walletClient: WalletClient | null
): AirdropService {
  return new AirdropService(address, publicClient, walletClient);
}
