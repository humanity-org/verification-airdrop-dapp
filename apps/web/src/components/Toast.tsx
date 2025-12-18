import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, Info, ExternalLink, X } from 'lucide-react';
import { useAirdropStore } from '../stores/airdropStore';

const Toast: React.FC = () => {
  const toasts = useAirdropStore((state) => state.toasts);
  const removeToast = useAirdropStore((state) => state.removeToast);

  const getIcon = (type: 'success' | 'error' | 'info') => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStyles = (type: 'success' | 'error' | 'info') => {
    switch (type) {
      case 'success':
        return 'bg-green-500/10 border-green-500/20';
      case 'error':
        return 'bg-red-500/10 border-red-500/20';
      case 'info':
        return 'bg-blue-500/10 border-blue-500/20';
    }
  };

  const getScanUrl = (txHash: string) => {
    return `https://testnet.humanityscan.io/tx/${txHash}`;
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-md">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onClose={() => removeToast(toast.id)}
          getIcon={getIcon}
          getStyles={getStyles}
          getScanUrl={getScanUrl}
        />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: {
    id: string;
    type: 'success' | 'error' | 'info';
    message: string;
    txHash?: string;
  };
  onClose: () => void;
  getIcon: (type: 'success' | 'error' | 'info') => React.ReactNode;
  getStyles: (type: 'success' | 'error' | 'info') => string;
  getScanUrl: (txHash: string) => string;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose, getIcon, getStyles, getScanUrl }) => {
  const [isVisible, setIsVisible] = React.useState(false);

  useEffect(() => {
    // Trigger animation
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation
  };

  return (
    <div
      className={`glass rounded-2xl border p-4 shadow-2xl transform transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      } ${getStyles(toast.type)}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">{getIcon(toast.type)}</div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white leading-relaxed">{toast.message}</p>

          {toast.txHash && (
            <a
              href={getScanUrl(toast.txHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-xs text-green-400 hover:text-green-300 transition-colors group"
            >
              <span>View on Explorer</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          )}
        </div>

        <button
          onClick={handleClose}
          className="flex-shrink-0 p-1 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Close notification"
        >
          <X className="w-4 h-4 text-white/40 hover:text-white/60" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
