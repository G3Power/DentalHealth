import { describe, expect, it } from '@jest/globals';

import { formatConfidence, presentLevel, presentWellnessStatus } from '@/analysis/present';
import type { ObservationLevel, WellnessStatus } from '@/analysis/types';

describe('presentLevel', () => {
  it('maps every level to a non-empty label and theme colors', () => {
    const levels: ObservationLevel[] = ['informational', 'monitor', 'seek-care'];
    for (const level of levels) {
      const presentation = presentLevel(level);
      expect(presentation.label.length).toBeGreaterThan(0);
      expect(presentation.color).toBeTruthy();
      expect(presentation.background).toBeTruthy();
    }
  });

  it('uses a distinct accent color per level', () => {
    expect(presentLevel('informational').color).toBe('info');
    expect(presentLevel('monitor').color).toBe('monitor');
    expect(presentLevel('seek-care').color).toBe('seekCare');
  });
});

describe('presentWellnessStatus', () => {
  it('maps every status to a non-empty label', () => {
    const statuses: WellnessStatus[] = ['supportive', 'neutral', 'room-to-improve'];
    for (const status of statuses) {
      expect(presentWellnessStatus(status).label.length).toBeGreaterThan(0);
    }
  });
});

describe('formatConfidence', () => {
  it('formats a fraction as a percentage', () => {
    expect(formatConfidence(0.55)).toBe('55% confidence');
  });

  it('clamps values outside 0..1', () => {
    expect(formatConfidence(-1)).toBe('0% confidence');
    expect(formatConfidence(2)).toBe('100% confidence');
  });
});
