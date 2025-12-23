import { createConfig, http } from 'wagmi';
import { defineChain } from 'viem';
import type { Config } from 'wagmi';
import { injected, walletConnect } from 'wagmi/connectors';
import { humanityTestnet as viemHumanityTestnet } from 'viem/chains'

/**
 * Humanity Protocol Testnet - Official Configuration
 * 
 * ⚠️ IMPORTANT: Do NOT use viem/chains humanityTestnet - it has WRONG chainId (7080969)
 * 
 * Official Configuration:
 * - Chain ID: 1942999413 (VERIFIED from official sources)
 * - Network: Humanity Protocol Testnet
 * - Token: tHP (Testnet Humanity)
 * 
 * Sources:
 * - https://thirdweb.com/humanity-testnet (Official)
 * - https://explorer.testnet.humanity.org (Block Explorer)
 * - https://humanity-testnet.explorer.alchemy.com/ (Alchemy Explorer)
 * 
 * Problem: viem/chains has incorrect chainId (7080969 instead of 1942999413)
 * Solution: Manual definition with correct official values
 */
export const humanityTestnet = defineChain({
  ...viemHumanityTestnet,
  name: 'Humanity Protocol testnet',
  rpcUrls: {
    default: {
      http: ['https://humanity-testnet.g.alchemy.com/public'],
    },
  },
})

/**
 * Wagmi configuration with explicit transports
 * 
 * Key changes:
 * 1. Use createConfig instead of getDefaultConfig for better control
 * 2. Explicitly configure transports for each chain
 * 3. Add connectors manually for wallet support
 * 
 * This fixes the "wrong network" issue in RainbowKit
 */
export const config: Config = createConfig({
  chains: [humanityTestnet],
  transports: {
    [humanityTestnet.id]: http(), // Automatically uses the chain's default RPC URL
  },
  connectors: [
    injected(),
    walletConnect({
      projectId: (import.meta.env.VITE_WALLETCONNECT_PROJECT_ID as string | undefined) || 'demo_project_id',
    }),
  ],
});
