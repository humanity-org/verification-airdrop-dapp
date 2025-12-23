import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { CheckCircle2, AlertCircle, Gift, Wallet } from 'lucide-react';
import { AirdropStatus, VerificationStatus, type LoadingState } from '../types/contracts';
import { LoadingSpinner } from './LoadingSpinner';
import { getLoadingMessage } from '../utils/loadingMessages';

interface ActionButtonProps {
  isConnected: boolean;
  status: AirdropStatus;
  isClaimed: boolean;
  loadingState: LoadingState;
  isWalletClientLoading: boolean;
  verificationStatus: VerificationStatus;
  onClaimAirdrop: () => void;
  onRetry: () => void;
}

/**
 * ActionButton - Main action button component
 *
 * Renders different buttons based on current state:
 * - Disconnected: Show connect wallet button
 * - Checking: Show loading state
 * - Need verification: Show verify human proof button
 * - Ready to claim: Show claim button
 * - Claimed: Show claimed status
 * - Error: Show retry button
 */
const ActionButton: React.FC<ActionButtonProps> = ({
  isConnected,
  status,
  isClaimed,
  loadingState,
  isWalletClientLoading,
  verificationStatus,
  onClaimAirdrop,
  onRetry,
}) => {
  // Loading state helpers
  const isCheckingClaim = loadingState.type === 'checking_claim';
  const isCheckingHuman = loadingState.type === 'checking_human';
  const isVerifyingHuman = loadingState.type === 'verifying_human';
  const isClaiming = loadingState.type === 'claiming';
  const isAnyLoading = isCheckingClaim || isCheckingHuman || isVerifyingHuman || isClaiming;

  // If already claimed, show disabled button
  if (isClaimed) {
    return (
      <button
        disabled
        className="w-full py-2.5 rounded-xl bg-white/5 text-white/20 font-bold text-sm cursor-not-allowed flex items-center justify-center gap-2 border border-white/5"
      >
        <CheckCircle2 className="w-4 h-4" />
        <span>Already Claimed</span>
      </button>
    );
  }

  // If not connected, show connect wallet button
  if (!isConnected || status === AirdropStatus.DISCONNECTED) {
    return (
      <div className="w-full">
        <ConnectButton.Custom>
          {({ openConnectModal }) => (
            <button
              onClick={openConnectModal}
              disabled={isWalletClientLoading}
              className="w-full py-2.5 rounded-xl bg-[rgb(124,255,74)] hover:bg-[rgb(104,235,54)] text-black font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Wallet className="w-4 h-4" />
              <span>Connect Wallet</span>
            </button>
          )}
        </ConnectButton.Custom>
      </div>
    );
  }

  // If checking or loading, show loading state
  if (isAnyLoading) {
    const message = getLoadingMessage(loadingState);
    return (
      <button
        disabled
        className="w-full py-2.5 rounded-xl bg-white/5 text-white/60 font-bold text-sm cursor-not-allowed flex items-center justify-center gap-2 border border-white/10"
      >
        <LoadingSpinner />
        <span>{message || 'Loading...'}</span>
      </button>
    );
  }

  // If error state, show retry button
  if (status === AirdropStatus.ERROR) {
    return (
      <button
        onClick={onRetry}
        className="w-full py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 border border-red-500/20 cursor-pointer"
      >
        <AlertCircle className="w-4 h-4" />
        <span>Retry</span>
      </button>
    );
  }

  // If ready to claim, show claim button
  // Display different text based on human verification status
  // Note: We allow claiming regardless of allocation, as the contract will handle eligibility
  if (status === AirdropStatus.READY_TO_CLAIM) {
    const isVerified = verificationStatus === VerificationStatus.Success;
    return (
      <button
        onClick={onClaimAirdrop}
        className="w-full py-2.5 rounded-xl bg-[rgb(124,255,74)] hover:bg-[rgb(104,235,54)] text-black font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 cursor-pointer"
      >
        <Gift className="w-4 h-4" />
        <span>{isVerified ? 'Claim Airdrop' : 'Verify And Claim'}</span>
      </button>
    );
  }

  // Default: Show claim button for connected wallets (unless already claimed or in error state)
  return (
    <button
      onClick={onClaimAirdrop}
      className="w-full py-2.5 rounded-xl bg-[rgb(124,255,74)] hover:bg-[rgb(104,235,54)] text-black font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 cursor-pointer"
    >
      <Gift className="w-4 h-4" />
      <span>Claim Airdrop</span>
    </button>
  );
};

export default ActionButton;
