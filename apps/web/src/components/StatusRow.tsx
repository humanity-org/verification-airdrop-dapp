import React from 'react';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface StatusRowProps {
  label: string;
  value?: string | undefined;
  status: 'loading' | 'success' | 'error' | 'pending';
  onVerify?: () => void;
  showVerifyButton?: boolean;
  statusText?: string; // Custom status text
}

const StatusRow: React.FC<StatusRowProps> = ({ 
  label, 
  value, 
  status = 'pending', 
  onVerify, 
  showVerifyButton = false,
  statusText 
}) => {
  const getIcon = () => {
    switch (status) {
      case 'loading': return <Loader2 className="w-3.5 h-3.5 animate-spin text-green-500" />;
      case 'success': return <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />;
      case 'error': return <XCircle className="w-3.5 h-3.5 text-red-500" />;
      default: return <div className="w-3.5 h-3.5 rounded-full border border-white/20" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success': return 'text-green-500';
      case 'error': return 'text-red-500';
      case 'loading': return 'text-white/60';
      default: return 'text-white/20';
    }
  };

  const getDefaultStatusText = () => {
    switch (status) {
      case 'success': return 'Verified';
      case 'error': return 'Failed';
      case 'loading': return 'Verifying...';
      default: return 'Pending';
    }
  };

  const displayText = statusText ?? getDefaultStatusText();

  return (
    <div className="flex items-center justify-between p-3.5 md:p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] transition-all hover:bg-white/[0.04] hover:border-white/10 group">
      <div className="flex items-center gap-2.5">
        <div className={`transition-colors duration-500 ${getStatusColor()}`}>
          {getIcon()}
        </div>
        <span className="text-xs font-semibold tracking-tight text-white/60 group-hover:text-white transition-colors">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {value && (
          <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[9px] font-mono text-white/30 hidden sm:block">
            {value}
          </span>
        )}
        {showVerifyButton && onVerify ? (
          <button
            onClick={onVerify}
            disabled={status === 'loading'}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              status === 'loading'
                ? 'bg-white/5 text-white/30 cursor-not-allowed'
                : 'bg-green-500/10 hover:bg-green-500/20 text-green-400 hover:text-green-300 active:scale-95 cursor-pointer'
            }`}
          >
            {status === 'loading' ? 'Verifying...' : 'Verify'}
          </button>
        ) : (
          <span className={`text-xs font-medium transition-colors ${getStatusColor()}`}>
            {displayText}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatusRow;
