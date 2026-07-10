import type { ThemeColor } from '@/constants/theme';
import { assertNever } from '@/lib/assert-never';

import type { ObservationLevel, WellnessStatus } from './types';

export interface LevelPresentation {
  label: string;
  /** Foreground/accent color key from the theme. */
  color: ThemeColor;
  /** Soft background color key from the theme. */
  background: ThemeColor;
}

export function presentLevel(level: ObservationLevel): LevelPresentation {
  switch (level) {
    case 'informational':
      return { label: 'Good to know', color: 'info', background: 'infoBg' };
    case 'monitor':
      return { label: 'Keep an eye on this', color: 'monitor', background: 'monitorBg' };
    case 'seek-care':
      return { label: 'Worth a professional look', color: 'seekCare', background: 'seekCareBg' };
    default:
      return assertNever(level);
  }
}

export function presentWellnessStatus(status: WellnessStatus): LevelPresentation {
  switch (status) {
    case 'supportive':
      return { label: 'Supportive', color: 'positive', background: 'positiveBg' };
    case 'neutral':
      return { label: 'Neutral', color: 'info', background: 'infoBg' };
    case 'room-to-improve':
      return { label: 'Room to improve', color: 'monitor', background: 'monitorBg' };
    default:
      return assertNever(status);
  }
}

export function formatConfidence(confidence: number): string {
  const clamped = Math.max(0, Math.min(1, confidence));
  return `${Math.round(clamped * 100)}% confidence`;
}
