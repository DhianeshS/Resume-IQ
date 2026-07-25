import React from 'react';

/**
 * Score rating thresholds and badge styling utilities
 */

export interface ScoreStyle {
  textColor: string;
  bgColor: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
  barColor: string;
  label: string;
}

/**
 * Returns consistent tailwind color classes for a numerical score (0-100)
 */
export function getScoreStyle(score: number): ScoreStyle {
  if (score >= 80) {
    return {
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50/60',
      borderColor: 'border-emerald-200',
      badgeBg: 'bg-emerald-50',
      badgeText: 'text-emerald-700',
      barColor: 'bg-emerald-500',
      label: 'Excellent',
    };
  }
  if (score >= 60) {
    return {
      textColor: 'text-amber-600',
      bgColor: 'bg-amber-50/60',
      borderColor: 'border-amber-200',
      badgeBg: 'bg-amber-50',
      badgeText: 'text-amber-700',
      barColor: 'bg-amber-500',
      label: 'Good',
    };
  }
  return {
    textColor: 'text-rose-600',
    bgColor: 'bg-rose-50/60',
    borderColor: 'border-rose-200',
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-700',
    barColor: 'bg-rose-500',
    label: 'Needs Work',
  };
}

/**
 * Format date string into human-readable format
 */
export function formatDate(isoString?: string): string {
  if (!isoString) return 'Just now';
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'Recently';
  }
}
