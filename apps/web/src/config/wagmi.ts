import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { defineChain } from 'viem';
import type { Config } from 'wagmi';

// Define Humanity Testnet chain
export const humanityTestnet = defineChain({
  id: 1287,
  name: 'Humanity Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Humanity',
    symbol: 'HP',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.humanity.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Humanity Explorer',
      url: 'https://testnet.humanityscan.io',
    },
  },
  testnet: true,
});

// Wagmi configuration
export const config: Config = getDefaultConfig({
  appName: 'Humanity Airdrop Portal',
  projectId: (import.meta.env.VITE_WALLETCONNECT_PROJECT_ID as string | undefined) || 'demo_project_id',
  chains: [humanityTestnet],
  ssr: false,
});
