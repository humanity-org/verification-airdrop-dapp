import { decodeErrorResult } from 'viem';
import AirdropABI from '../abis/Airdrop.json';

/**
 * Decode error data from a contract revert
 *
 * Example error data:
 * 0xcdd0b425000000000000000000000000261b79ba26765fa09c9607d2c311af002ea44c320000000000000000000000000ccfa1ae4578067cf8afb8e22b12a98c44eba3cd
 */
export function decodeContractError(errorData: `0x${string}`) {
  try {
    // Get error selector (first 4 bytes / 10 characters including 0x)
    const errorSelector = errorData.slice(0, 10);
    console.log('Error selector:', errorSelector);

    // Decode the error using the Airdrop ABI
    const decodedError = decodeErrorResult({
      abi: AirdropABI,
      data: errorData,
    });

    console.log('Decoded error:', decodedError);

    return {
      errorName: decodedError.errorName,
      args: decodedError.args,
      selector: errorSelector,
    };
  } catch (error) {
    console.error('Failed to decode error:', error);
    return null;
  }
}

/**
 * Check if error selector matches UnauthorizedRequest
 * UnauthorizedRequest(address expectedSigner, address actualSigner)
 */
export function isUnauthorizedRequestError(errorData: `0x${string}`): boolean {
  const errorSelector = errorData.slice(0, 10);
  // The selector for UnauthorizedRequest should be 0xcdd0b425
  return errorSelector === '0xcdd0b425';
}

// Example usage for debugging
if (import.meta.env.DEV) {
  const exampleErrorData = '0xcdd0b425000000000000000000000000261b79ba26765fa09c9607d2c311af002ea44c320000000000000000000000000ccfa1ae4578067cf8afb8e22b12a98c44eba3cd' as `0x${string}`;

  console.log('=== Decoding Error ===');
  const decoded = decodeContractError(exampleErrorData);

  if (decoded) {
    console.log('Error Name:', decoded.errorName);
    console.log('Error Args:', decoded.args);

    if (decoded.errorName === 'UnauthorizedRequest') {
      const [expectedSigner, actualSigner] = decoded.args as [string, string];
      console.log('Expected Signer:', expectedSigner);
      console.log('Actual Signer:', actualSigner);
      console.log('Match:', expectedSigner.toLowerCase() === actualSigner.toLowerCase());
    }
  }
}
