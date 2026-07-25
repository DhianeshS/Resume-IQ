import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card' | 'statCard';
}

/**
 * Reusable Skeleton loader for asynchronous data fetching states.
 * Provides accessible pulsing placeholder elements to eliminate layout shifts.
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
}) => {
  const baseClasses = 'animate-pulse bg-gray-200/70 rounded-xl';

  if (variant === 'circular') {
    return (
      <div
        aria-hidden="true"
        className={`${baseClasses} rounded-full ${className}`}
      />
    );
  }

  if (variant === 'text') {
    return (
      <div
        aria-hidden="true"
        className={`${baseClasses} h-4 w-full rounded-md ${className}`}
      />
    );
  }

  if (variant === 'statCard') {
    return (
      <div
        aria-hidden="true"
        className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-xs flex items-center justify-between space-y-2 animate-pulse"
      >
        <div className="space-y-2.5 flex-1 pr-4">
          <div className="h-3 w-24 bg-gray-200/80 rounded-md" />
          <div className="h-8 w-20 bg-gray-200/80 rounded-lg" />
          <div className="h-3 w-32 bg-gray-100 rounded-md" />
        </div>
        <div className="w-12 h-12 rounded-2xl bg-gray-100 shrink-0" />
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div
        aria-hidden="true"
        className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-xs space-y-4 animate-pulse"
      >
        <div className="flex items-center justify-between">
          <div className="h-4 w-1/3 bg-gray-200/80 rounded-md" />
          <div className="h-6 w-16 bg-gray-200/80 rounded-full" />
        </div>
        <div className="h-3 w-full bg-gray-100 rounded-md" />
        <div className="h-3 w-4/5 bg-gray-100 rounded-md" />
        <div className="pt-2 flex items-center gap-2">
          <div className="h-8 w-20 bg-gray-200/60 rounded-xl" />
          <div className="h-8 w-20 bg-gray-200/60 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`${baseClasses} ${className}`}
    />
  );
};
