import { describe, expect, it } from '@jest/globals';

import {
  createModelAnalyzer,
  mapScoresToObservations,
  mapScoresToResult,
  unavailableModelRunner,
  type OralModelRunner,
} from '@/analysis/model/model-analyzer';
import { INDICATORS } from '@/analysis/taxonomy';
import type { AnalysisInput } from '@/analysis/types';

const input: AnalysisInput = {
  imageUri: 'file:///tmp/photo.jpg',
  width: 1080,
  height: 1440,
  capturedAt: Date.UTC(2026, 0, 1),
};

describe('mapScoresToObservations', () => {
  it('surfaces an indicator scored at/above its threshold', () => {
    const observations = mapScoresToObservations({ 'gingival-inflammation': 0.9 });
    expect(observations).toHaveLength(1);
    expect(observations[0].category).toBe(INDICATORS['gingival-inflammation'].category);
    expect(observations[0].confidence).toBeCloseTo(0.9);
  });

  it('omits indicators below their threshold', () => {
    expect(mapScoresToObservations({ 'gingival-inflammation': 0.1 })).toHaveLength(0);
  });

  it('ignores missing scores', () => {
    expect(mapScoresToObservations({})).toHaveLength(0);
  });

  it('clamps out-of-range scores to 0..1', () => {
    const observations = mapScoresToObservations({ 'tooth-staining': 5 });
    expect(observations[0].confidence).toBe(1);
  });
});

describe('mapScoresToResult', () => {
  it('produces a real (non-demo) on-device result', () => {
    const result = mapScoresToResult({ 'plaque-tartar': 0.8 }, { capturedAt: input.capturedAt });
    expect(result.isDemo).toBe(false);
    expect(result.source).toBe('on-device');
    expect(result.observations).toHaveLength(1);
    expect(result.wellness.length).toBeGreaterThan(0);
  });

  it('uses a safe, non-reassuring summary when nothing is surfaced', () => {
    const result = mapScoresToResult({}, { capturedAt: input.capturedAt });
    expect(result.observations).toHaveLength(0);
    expect(result.summary.toLowerCase()).toContain('not a clean bill');
  });
});

describe('createModelAnalyzer', () => {
  it('refuses to run when no model is available (fail-safe)', async () => {
    const analyzer = createModelAnalyzer(unavailableModelRunner);
    await expect(analyzer.analyze(input)).rejects.toThrow();
  });

  it('runs when a model is available', async () => {
    const runner: OralModelRunner = {
      modelId: 'test-model',
      isAvailable: () => true,
      run: async () => ({ 'gingival-inflammation': 0.7 }),
    };
    const result = await createModelAnalyzer(runner).analyze(input);
    expect(result.source).toBe('on-device');
    expect(result.observations).toHaveLength(1);
  });
});
