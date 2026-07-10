import { runMockAnalysis } from './mock-analyzer';
import type { AnalysisInput, AnalysisResult, AnalysisSource } from './types';

/**
 * The single seam between the UI and whatever produces results.
 *
 * Phase 0 ships a mock. Phase 1+ can register an on-device model (e.g. a
 * TensorFlow Lite / ONNX / Core ML wrapper) or a server-backed analyzer by
 * implementing this interface and passing it to `setAnalyzer`. No screen imports
 * a concrete analyzer directly — they all go through `getAnalyzer()`.
 */
export interface OralAnalyzer {
  readonly source: AnalysisSource;
  /** Whether this analyzer produces illustrative (non-real) results. */
  readonly isDemo: boolean;
  analyze(input: AnalysisInput): Promise<AnalysisResult>;
}

const mockAnalyzer: OralAnalyzer = {
  source: 'mock',
  isDemo: true,
  analyze: runMockAnalysis,
};

let currentAnalyzer: OralAnalyzer = mockAnalyzer;

export function getAnalyzer(): OralAnalyzer {
  return currentAnalyzer;
}

/** Swap the active analyzer (used when a real model is wired up, and in tests). */
export function setAnalyzer(analyzer: OralAnalyzer): void {
  currentAnalyzer = analyzer;
}
