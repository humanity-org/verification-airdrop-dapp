import React from 'react';
import { Globe } from 'lucide-react';
import { type Address } from 'viem';
import StatusRow from './StatusRow';
import ActionButton from './ActionButton';
import { AirdropStatus, VerificationStatus, type LoadingState } from '../types/contracts';

interface AirdropCardProps {
  // Wallet state
  address: Address | undefined;
  isConnected: boolean;
  isWalletClientLoading: boolean;

  // Airdrop state
  status: AirdropStatus;
  verificationStatus: VerificationStatus;
  isClaimed: boolean;
  allocation: string;
  humanStatusChecked: boolean;
  loadingState: LoadingState;
  error: string | null;

  // Token information
  tokenBalance: string;
  tokenSymbol: string;

  // Action methods
  onClaimAirdrop: () => void;
  onRetry: () => void;
}

/**
 * AirdropCard - Core airdrop card component
 * 
 * Contains:
 * - Status rows (wallet, human proof)
 * - Error notification
 * - Main action button
 * - Detail statistics (total amount, personal allocation)
 * - Social links
 */
const AirdropCard: React.FC<AirdropCardProps> = ({
  address,
  isConnected,
  isWalletClientLoading,
  status,
  verificationStatus,
  isClaimed,
  allocation,
  tokenBalance,
  tokenSymbol,
  humanStatusChecked,
  loadingState,
  error,
  onClaimAirdrop,
  onRetry,
}) => {
  const isCheckingHuman = loadingState.type === 'checking_human';
  const isVerifyingHuman = loadingState.type === 'verifying_human';

  // Get status display helpers
  const getWalletStatus = (): 'pending' | 'loading' | 'success' | 'error' => {
    if (status === AirdropStatus.DISCONNECTED) return 'pending';
    if (status === AirdropStatus.CONNECTING) return 'loading';
    return 'success';
  };

  /**
   * Get human verification status and display text
   * Map VerificationStatus enum to user-friendly UI status and text
   */
  const getHumanStatusInfo = (): { status: 'pending' | 'loading' | 'success' | 'error'; text: string } => {
    // If verifying or checking, show loading
    if (isVerifyingHuman || isCheckingHuman) {
      return { status: 'loading', text: 'Checking...' };
    }

    // If status not checked yet, show pending
    if (!humanStatusChecked) {
      return { status: 'pending', text: 'Pending' };
    }

    // Return corresponding UI status and text based on verification status
    switch (verificationStatus) {
      case VerificationStatus.None:
        return { status: 'pending', text: 'Need Verify' };
      case VerificationStatus.Pending:
        return { status: 'loading', text: 'Verifying...' };
      case VerificationStatus.Failed:
        return { status: 'error', text: 'Failed' };
      case VerificationStatus.Success:
        return { status: 'success', text: 'Verified' };
      default:
        return { status: 'pending', text: 'Unknown' };
    }
  };

  const humanStatusInfo = getHumanStatusInfo();

  return (
    <div className="w-full max-w-lg z-10 flex flex-col gap-6 md:gap-8 items-center justify-center py-12">
      {/* Header text */}
      <div className="text-center space-y-3 reveal delay-1">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-bold tracking-[0.2em] text-green-400 uppercase">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
          </span>
          Phase 1 Live
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter leading-tight">
          Proof of <span className="text-green-500">Humanity</span>
        </h1>
        <p className="text-white/40 text-sm md:text-base max-w-xs mx-auto font-medium leading-relaxed">
          Claim your Humanity Protocol airdrop with verified proof-of-humanity.
        </p>
      </div>

      {/* Core interaction card */}
      <div className="animate-float reveal delay-2 w-full">
        <div className="glass rounded-[32px] p-0.5 shadow-[0_0_60px_rgba(0,0,0,0.4)] group">
          <div className="bg-[#080808] rounded-[30px] p-6 md:p-8 relative overflow-hidden">
            <div className="scanline" />

            <div className="space-y-6 relative">
              <div className="space-y-3">
                <div className="flex justify-between items-end px-1">
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                    Airdrop Check
                  </h2>
                </div>

                <div className="space-y-2">
                  <StatusRow
                    label="EVM Wallet"
                    value={address ? `${address.slice(0, 6)}...${address.slice(-4)}` : undefined}
                    status={getWalletStatus()}
                  />
                  <StatusRow
                    label="Human Proof"
                    status={humanStatusInfo.status}
                    statusText={humanStatusInfo.text}
                  />
                </div>
              </div>

              {/* Error notification */}
              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                  {error}
                </div>
              )}

              <div className="pt-1 flex">
                <ActionButton
                  isConnected={isConnected}
                  status={status}
                  isClaimed={isClaimed}
                  loadingState={loadingState}
                  isWalletClientLoading={isWalletClientLoading}
                  verificationStatus={verificationStatus}
                  onClaimAirdrop={onClaimAirdrop}
                  onRetry={onRetry}
                />
              </div>

              {/* Bottom details */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-center">
                  <div className="text-[9px] text-white/20 uppercase font-bold tracking-widest mb-0.5">
                    Your Balance
                  </div>
                  <div className="text-sm font-bold">
                    {tokenBalance} <span className="text-green-500 text-[10px]">${tokenSymbol}</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-center">
                  <div className="text-[9px] text-white/20 uppercase font-bold tracking-widest mb-0.5">
                    Your Share
                  </div>
                  <div className="text-sm font-bold">
                    {allocation || '0'} <span className="text-green-500 text-[10px]">$DEMO</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social links */}
      <div className="flex justify-center gap-6 reveal delay-3">
        <a
          href="https://www.humanity.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 rounded-full glass hover:text-green-400 transition-all hover:scale-110 cursor-pointer"
        >
          <Globe className="w-4 h-4" />
        </a>
        <a
          href="https://x.com/Humanityprot"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 rounded-full glass hover:text-green-400 transition-all hover:scale-110 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default AirdropCard;
