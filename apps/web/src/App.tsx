import React, { useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { ArrowRight, Loader2, CheckCircle2, AlertCircle, Globe } from 'lucide-react';
import { useAirdropStore } from './stores/airdropStore';
import { AirdropStatus } from './types/contracts';
import StatusRow from './components/StatusRow';
import Toast from './components/Toast';
import { isMockMode } from './contracts/factory';
import humanityLogo from './assets/humanity-protocol-logo.svg';

const App: React.FC = () => {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  // Zustand store
  const {
    status,
    isHuman,
    isClaimed,
    allocation,
    error,
    claimStatusChecked,
    humanStatusChecked,
    isCheckingClaim,
    isCheckingHuman,
    isVerifyingHuman,
    isClaiming,
    setClients,
    connectWallet,
    disconnectWallet,
    checkClaimStatus,
    checkHumanStatus,
    verifyHuman,
    claimAirdrop,
  } = useAirdropStore();

  // Set blockchain clients
  useEffect(() => {
    setClients(publicClient ?? null, walletClient ?? null);
  }, [publicClient, walletClient, setClients]);

  // Handle wallet connection
  useEffect(() => {
    if (isConnected && address) {
      void connectWallet(address);
    } else if (!isConnected) {
      disconnectWallet();
    }
  }, [isConnected, address, connectWallet, disconnectWallet]);

  // Get status display
  const getWalletStatus = () => {
    if (status === AirdropStatus.DISCONNECTED) return 'pending';
    if (status === AirdropStatus.CONNECTING) return 'loading';
    return 'success';
  };

  const getHumanStatus = () => {
    if (isVerifyingHuman) return 'loading'; // 优先检查验证状态
    if (isCheckingHuman) return 'loading';
    if (!humanStatusChecked) return 'pending';
    if (status === AirdropStatus.NOT_HUMAN) return 'error';
    if (isHuman) return 'success';
    return 'error';
  };

  const getClaimStatus = () => {
    if (!isConnected) return 'pending';
    if (isCheckingClaim) return 'loading';
    if (!claimStatusChecked) return 'pending';
    if (status === AirdropStatus.ERROR) return 'error';
    
    // 已领取显示错误icon，未领取显示成功icon
    return isClaimed ? 'error' : 'success';
  };

  console.log('getHumanStatus()', isHuman, getHumanStatus())

  // Render main action button
  const renderActionButton = () => {
    // If already claimed, show disabled button
    if (isClaimed) {
      return (
        <button
          disabled
          className="w-full py-4 rounded-2xl bg-white/5 text-white/20 font-bold text-base cursor-not-allowed flex items-center justify-center gap-2 border border-white/5"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>Already Claimed</span>
        </button>
      );
    }

    if (!isConnected) {
      return (
        <div className="w-full">
          <ConnectButton.Custom>
            {({ openConnectModal }) => (
              <button
                onClick={openConnectModal}
                className="w-full py-4 rounded-2xl bg-green-500 text-white font-bold text-base hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:bg-green-600"
              >
                <span>Connect Wallet</span>
              </button>
            )}
          </ConnectButton.Custom>
        </div>
      );
    }

    if (isCheckingClaim || isCheckingHuman) {
      return (
        <button
          disabled
          className="w-full py-4 rounded-2xl bg-white/10 text-white/40 font-bold text-base cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Checking...</span>
        </button>
      );
    }

    if (isVerifyingHuman) {
      return (
        <button
          disabled
          className="w-full py-4 rounded-2xl bg-yellow-500/20 border border-yellow-500/30 text-yellow-200 font-bold text-base cursor-wait flex items-center justify-center gap-2"
        >
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Verifying Human...</span>
        </button>
      );
    }

    if (status === AirdropStatus.ALREADY_CLAIMED) {
      return (
        <button
          disabled
          className="w-full py-4 rounded-2xl bg-white/5 text-white/20 font-bold text-base cursor-not-allowed flex items-center justify-center gap-2 border border-white/5"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>Already Claimed</span>
        </button>
      );
    }

    if (status === AirdropStatus.NOT_HUMAN) {
      return (
        <button
          onClick={() => void verifyHuman()}
          className="w-full py-4 rounded-2xl bg-yellow-500/20 border border-yellow-500/30 text-yellow-200 font-bold text-base hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
        >
          <AlertCircle className="w-5 h-5" />
          <span>Verify Human Proof</span>
        </button>
      );
    }

    // Check isClaiming BEFORE READY_TO_CLAIM to ensure loading state is shown
    if (isClaiming) {
      return (
        <button
          disabled
          className="w-full py-4 rounded-2xl bg-green-500/20 border border-green-500/30 text-green-200 font-bold text-base cursor-wait flex items-center justify-center gap-2"
        >
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Claiming...</span>
        </button>
      );
    }

    if (status === AirdropStatus.READY_TO_CLAIM) {
      return (
        <button
          onClick={() => void claimAirdrop()}
          className="w-full py-4 rounded-2xl shimmer-btn text-black font-bold text-base hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(34,197,94,0.3)]"
        >
          <span>Claim ${allocation} $DEMO</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      );
    }

    if (status === AirdropStatus.CLAIMED) {
      return (
        <button
          disabled
          className="w-full py-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-500 font-bold text-base cursor-not-allowed flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>Claimed Successfully!</span>
        </button>
      );
    }

    if (status === AirdropStatus.ERROR) {
      return (
        <button
          onClick={() => void checkHumanStatus()}
          className="w-full py-4 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-200 font-bold text-base hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
        >
          <AlertCircle className="w-5 h-5" />
          <span>Retry</span>
        </button>
      );
    }

    return null;
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden">
      {/* Toast Notifications */}
      <Toast />

      {/* 动态光球背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[15%] left-[10%] w-72 h-72 bg-green-500/10 blur-[100px] rounded-full animate-pulse" />
        <div
          className="absolute bottom-[15%] right-[15%] w-[400px] h-[400px] bg-blue-600/5 blur-[120px] rounded-full animate-pulse"
          style={{ animationDelay: '2s' }}
        />
      </div>

      {/* 导航栏 */}
      <nav className="fixed top-0 w-full p-6 flex justify-between items-center z-50 reveal">
        <div className="relative top-4 left-4 md:left-8">
          <img 
            alt="humanity protocol" 
            width="141" 
            height="32" 
            className="w-[140px] h-auto md:w-[170px]"
            src={humanityLogo}
          />
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          {isMockMode() && (
            <div className="px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-bold">
              MOCK MODE
            </div>
          )}
          <ConnectButton chainStatus="icon" showBalance={false} />
        </div>
      </nav>

      {/* 主体内容容器 */}
      <div className="w-full max-w-lg z-10 flex flex-col gap-6 md:gap-8 items-center justify-center py-12">
        {/* 头部文案 */}
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

        {/* 核心交互卡片 */}
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
                    <span className="text-[9px] font-mono text-green-500/30">ID: HP-8829-ZK</span>
                  </div>

                  <div className="space-y-2">
                    <StatusRow
                      label="EVM Wallet"
                      value={address ? `${address.slice(0, 6)}...${address.slice(-4)}` : undefined}
                      status={getWalletStatus()}
                    />

                    <StatusRow 
                      label="Claim Status" 
                      status={getClaimStatus()}
                      statusText={isClaimed ? "Already Claimed" : "Not Claimed Yet"}
                      onVerify={() => void checkClaimStatus()}
                    />

                    <StatusRow
                      label="Human Proof"
                      status={getHumanStatus()}
                      onVerify={() => void verifyHuman()}
                      showVerifyButton={
                        isConnected &&
                        !(humanStatusChecked && isHuman) &&
                        !isCheckingHuman &&
                        !isVerifyingHuman
                      }
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                    {error}
                  </div>
                )}

                <div className="pt-1">{renderActionButton()}</div>

                {/* 底部详情 */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-center">
                    <div className="text-[9px] text-white/20 uppercase font-bold tracking-widest mb-0.5">
                      Supply
                    </div>
                    <div className="text-sm font-bold">
                      1.2B <span className="text-green-500 text-[10px]">$DEMO</span>
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

        {/* 社交链接 */}
        <div className="flex justify-center gap-6 reveal delay-3">
          <a
            href="https://www.humanity.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-full glass hover:text-green-400 transition-all hover:scale-110"
          >
            <Globe className="w-4 h-4" />
          </a>
          <a
            href="https://x.com/Humanityprot"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-full glass hover:text-green-400 transition-all hover:scale-110"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>
      </div>

      {/* 底部状态条 */}
      <footer className="fixed bottom-0 left-0 w-full p-4 glass border-t border-white/5 flex justify-between px-8 items-center text-[9px] font-bold tracking-widest text-white/20 uppercase reveal delay-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></span>
            Node: Optimal
          </div>
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-blue-500"></span>
            Humanity Testnet
          </div>
        </div>
        <div className="flex gap-6">
          <span className="hover:text-white transition-colors cursor-pointer">Security</span>
          <span className="hover:text-white transition-colors cursor-pointer">Terms</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
