import { describe, expect, it } from '@jest/globals';

import { getAnalyzer, setAnalyzer, type OralAnalyzer } from '@/analysis/analyzer';
import type { AnalysisInput, AnalysisResult } from '@/analysis/types';

const input: AnalysisInput = {
  imageUri: 'file:///tmp/photo.jpg',
  width: 800,
  height: 800,
  capturedAt: 0,
};

describe('analyzer provider', () => {
  it('defaults to the mock analyzer', () => {
    const analyzer = getAnalyzer();
    expect(analyzer.source).toBe('mock');
    expect(analyzer.isDemo).toBe(true);
  });

  it('can be swapped via setAnalyzer and restored', async () => {
    const original = getAnalyzer();
    const fake: OralAnalyzer = {
      source: 'on-device',
      isDemo: false,
      analyze: async (): Promise<AnalysisResult> => ({
        id: 'test',
        createdAt: new Date(0).toISOString(),
        source: 'on-device',
        isDemo: false,
        summary: 'stub',
        observations: [],
        wellness: [],
        nextSteps: [],
      }),
    };

    setAnalyzer(fake);
    try {
      expect(getAnalyzer().source).toBe('on-device');
      const result = await getAnalyzer().analyze(input);
      expect(result.isDemo).toBe(false);
      expect(result.source).toBe('on-device');
    } finally {
      setAnalyzer(original);
    }

    expect(getAnalyzer().source).toBe('mock');
  });
});
