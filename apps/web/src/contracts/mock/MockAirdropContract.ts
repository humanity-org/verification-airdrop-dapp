import type { Address } from 'viem';
import type { IAirdropContract } from '../../types/contracts';

/**
 * Mock airdrop contract for development without blockchain
 * Simulates airdrop contract behavior with predefined test data
 */
export class MockAirdropContract implements IAirdropContract {
  public readonly address: Address;
  private claimedAddresses = new Set<string>();
  private humanAddresses = new Set<string>();
  private allocations = new Map<string, bigint>();

  constructor(address: Address) {
    this.address = address;

    // Initialize mock data
    // Test address with 5000 tokens allocation
    const testAddress = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';
    this.humanAddresses.add(testAddress.toLowerCase());
    this.allocations.set(testAddress.toLowerCase(), BigInt(5000) * BigInt(10 ** 18));
  }

  read<T>(_functionName: string, _args?: unknown[]): Promise<T> {
    return Promise.reject(new Error('Method not implemented in mock'));
  }

  write(_functionName: string, _args?: unknown[]): Promise<string> {
    return Promise.reject(new Error('Method not implemented in mock'));
  }

  async isClaim(address: Address): Promise<boolean> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return this.claimedAddresses.has(address.toLowerCase());
  }

  async checkHuman(address: Address): Promise<boolean> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    return this.humanAddresses.has(address.toLowerCase());
  }

  async verifyHuman(): Promise<string> {
    // Simulate network delay for verification transaction
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Generate mock transaction hash
    const mockTxHash = `0x${Math.random().toString(16).substring(2).padStart(64, '0')}`;

    return mockTxHash;
  }

  async claim(): Promise<string> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generate mock transaction hash
    const mockTxHash = `0x${Math.random().toString(16).substring(2).padStart(64, '0')}`;

    return mockTxHash;
  }

  async getAllocation(address: Address): Promise<bigint> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const allocation = this.allocations.get(address.toLowerCase());
    return allocation || BigInt(0);
  }

  // Helper methods for testing
  setHumanStatus(address: Address, isHuman: boolean): void {
    if (isHuman) {
      this.humanAddresses.add(address.toLowerCase());
    } else {
      this.humanAddresses.delete(address.toLowerCase());
    }
  }

  setAllocation(address: Address, amount: bigint): void {
    this.allocations.set(address.toLowerCase(), amount);
  }

  markAsClaimed(address: Address): void {
    this.claimedAddresses.add(address.toLowerCase());
  }
}
