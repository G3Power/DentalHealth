import { describe, expect, it } from '@jest/globals';

import { runMockAnalysis } from '@/analysis/mock-analyzer';
import type { AnalysisInput } from '@/analysis/types';

const input: AnalysisInput = {
  imageUri: 'file:///tmp/photo.jpg',
  width: 1080,
  height: 1440,
  capturedAt: Date.UTC(2026, 0, 1),
};

describe('runMockAnalysis', () => {
  it('returns a demo result from the mock source', async () => {
    const result = await runMockAnalysis(input);
    expect(result.isDemo).toBe(true);
    expect(result.source).toBe('mock');
    expect(result.observations.length).toBeGreaterThan(0);
    expect(result.wellness.length).toBeGreaterThan(0);
    expect(result.nextSteps.length).toBeGreaterThan(0);
  });

  it('produces a valid ISO createdAt derived from the capture time', async () => {
    const result = await runMockAnalysis(input);
    expect(result.createdAt).toBe(new Date(input.capturedAt).toISOString());
  });

  it('always surfaces at least one "seek-care" observation', async () => {
    const result = await runMockAnalysis(input);
    const seekCare = result.observations.filter((o) => o.level === 'seek-care');
    expect(seekCare.length).toBeGreaterThan(0);
  });

  it('keeps every confidence within 0..1', async () => {
    const result = await runMockAnalysis(input);
    for (const observation of result.observations) {
      expect(observation.confidence).toBeGreaterThanOrEqual(0);
      expect(observation.confidence).toBeLessThanOrEqual(1);
    }
  });
});
