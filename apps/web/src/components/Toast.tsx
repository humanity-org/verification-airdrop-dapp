import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Info, ExternalLink, X } from 'lucide-react';
import { useToastStore } from '../stores/toastStore';

const Toast: React.FC = () => {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  // Feature 3: Detect user's motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Feature 2: Keyboard navigation - Escape key to close the most recent toast
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && toasts.length > 0) {
        // Close the most recent toast (last item in array)
        const lastToast = toasts[toasts.length - 1];
        if (lastToast) {
          removeToast(lastToast.id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toasts, removeToast]);

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
    <div
      role="region"
      aria-label="Notifications"
      aria-live="polite"
      aria-relevant="additions text"
      aria-atomic="false"
      className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-md"
    >
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onClose={() => removeToast(toast.id)}
          getIcon={getIcon}
          getStyles={getStyles}
          getScanUrl={getScanUrl}
          prefersReducedMotion={prefersReducedMotion}
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
  prefersReducedMotion: boolean;
}

const ToastItem: React.FC<ToastItemProps> = ({
  toast,
  onClose,
  getIcon,
  getStyles,
  getScanUrl,
  prefersReducedMotion,
}) => {
  const [isVisible, setIsVisible] = React.useState(false);

  useEffect(() => {
    // Trigger animation
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Feature 3: Reduce animation delay for reduced motion
    setTimeout(onClose, prefersReducedMotion ? 100 : 300);
  };

  // Feature 3: Conditional animation classes based on motion preference
  const animationClass = prefersReducedMotion
    ? // Reduced motion: simple opacity transition
      isVisible
      ? 'opacity-100'
      : 'opacity-0'
    : // Normal motion: slide + opacity
      isVisible
      ? 'translate-x-0 opacity-100'
      : 'translate-x-full opacity-0';

  const transitionClass = prefersReducedMotion
    ? 'transition-opacity duration-150'
    : 'transition-all duration-300';

  return (
    <div
      role={toast.type === 'error' ? 'alert' : 'status'}
      aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
      className={`glass rounded-2xl border p-4 shadow-2xl transform ${transitionClass} ${animationClass} ${getStyles(
        toast.type
      )}`}
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
              className="mt-2 inline-flex items-center gap-1.5 text-xs text-green-400 hover:text-green-300 transition-colors group cursor-pointer"
            >
              <span>View on Explorer</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          )}
        </div>

        <button
          onClick={handleClose}
          className="flex-shrink-0 p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Close notification"
        >
          <X className="w-4 h-4 text-white/40 hover:text-white/60" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
