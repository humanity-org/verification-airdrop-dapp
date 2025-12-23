import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Loading Spinner Component
 *
 * A simple, accessible loading indicator with size variants.
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
  };

  return (
    <div
      role="status"
      aria-label="Loading"
      className={`inline-block ${sizeClasses[size]} border-blue-500/30 border-t-blue-500 rounded-full animate-spin ${className}`}
    />
  );
};
