import React, { useEffect } from 'react';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { useShallow } from 'zustand/react/shallow';
import { useWalletStore } from './stores/walletStore';
import { useAirdropStore } from './stores/airdropStore';
import { useTokenStore } from './stores/tokenStore';
import Background from './components/Background';
import Header from './components/Header';
import AirdropCard from './components/AirdropCard';
import Toast from './components/Toast';

/**
 * App - Main application component
 * 
 * Responsibilities:
 * - Web3 client management
 * - Wallet connection state synchronization
 * - Component composition and layout
 */
const App: React.FC = () => {
  // Wagmi hooks for wallet connection
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient, isLoading: isWalletClientLoading } = useWalletClient();

  // Wallet store
  const setClients = useWalletStore((state) => state.setClients);
  const connectWallet = useWalletStore((state) => state.connect);
  const disconnectWallet = useWalletStore((state) => state.disconnect);

  // Airdrop store - use useShallow to optimize state subscription
  const {
    status,
    verificationStatus,
    isClaimed,
    allocation,
    error,
    humanStatusChecked,
    loadingState,
  } = useAirdropStore(
    useShallow((state) => ({
      status: state.status,
      verificationStatus: state.verificationStatus,
      isClaimed: state.isClaimed,
      allocation: state.allocation,
      error: state.error,
      humanStatusChecked: state.humanStatusChecked,
      loadingState: state.loadingState,
    }))
  );

  // Airdrop actions
  const checkClaimStatus = useAirdropStore((state) => state.checkClaimStatus);
  const checkHumanStatus = useAirdropStore((state) => state.checkHumanStatus);
  const claimAirdrop = useAirdropStore((state) => state.claimAirdrop);
  const resetAirdrop = useAirdropStore((state) => state.resetAll);

  // Token store
  const tokenBalance = useTokenStore((state) => state.balance);
  const tokenSymbol = useTokenStore((state) => state.symbol);
  const fetchTokenBalance = useTokenStore((state) => state.fetchBalance);
  const fetchTokenInfo = useTokenStore((state) => state.fetchTokenInfo);
  const resetToken = useTokenStore((state) => state.reset);

  // Set blockchain clients
  useEffect(() => {
    setClients(publicClient ?? null, walletClient ?? null);
  }, [publicClient, walletClient, setClients]);

  // Fetch token info on mount
  useEffect(() => {
    void fetchTokenInfo();
  }, [fetchTokenInfo]);

  // Handle wallet connection
  useEffect(() => {
    if (isConnected && address) {
      // Connect wallet in wallet store
      connectWallet(address);

      // Fetch token balance
      void fetchTokenBalance(address);

      // Automatically check claim status and human status after connecting (silent mode)
      void checkClaimStatus(false);
      void checkHumanStatus(false);
    } else if (!isConnected) {
      // Disconnect wallet and reset airdrop state
      disconnectWallet();
      resetAirdrop();
      resetToken();
    }
  }, [isConnected, address, connectWallet, disconnectWallet, checkClaimStatus, checkHumanStatus, resetAirdrop, fetchTokenBalance, resetToken]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden">
      {/* Toast Notifications */}
      <Toast />

      {/* Background */}
      <Background />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <AirdropCard
        address={address}
        isConnected={isConnected}
        status={status}
        verificationStatus={verificationStatus}
        isClaimed={isClaimed}
        allocation={allocation}
        tokenBalance={tokenBalance}
        tokenSymbol={tokenSymbol}
        humanStatusChecked={humanStatusChecked}
        loadingState={loadingState}
        error={error}
        isWalletClientLoading={isWalletClientLoading}
        onClaimAirdrop={() => void claimAirdrop()}
        onRetry={() => void claimAirdrop()}
      /></div>
  );
};

export default App;
