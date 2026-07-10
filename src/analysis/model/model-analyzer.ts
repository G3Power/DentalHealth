import { GENERAL_WELLNESS_SIGNALS } from '@/content/wellness';
import { clamp01 } from '@/lib/clamp';

import type { OralAnalyzer } from '../analyzer';
import { INDICATOR_IDS, INDICATORS, type IndicatorId } from '../taxonomy';
import type { AnalysisInput, AnalysisResult, Observation } from '../types';

/**
 * On-device model seam (Phase 1).
 *
 * A real classifier is wrapped by an `OralModelRunner` that returns a per-indicator
 * score. The score -> result mapping is a pure function (`mapScoresToResult`) so it
 * is fully unit-testable without a model. Until a model is actually bundled, the
 * default runner reports `isAvailable() === false`, the analyzer refuses to run, and
 * the app keeps using the mock. This keeps the medical-inference path fail-safe.
 */
export type ModelScores = Partial<Record<IndicatorId, number>>;

export interface OralModelRunner {
  readonly modelId: string;
  /** True only when a real model is present and loadable on this device. */
  isAvailable(): boolean;
  /** Returns a probability (0..1) per detected indicator. */
  run(input: AnalysisInput): Promise<ModelScores>;
}

function makeId(): string {
  return `scan-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function mapScoresToObservations(scores: ModelScores): Observation[] {
  const observations: Observation[] = [];
  for (const id of INDICATOR_IDS) {
    const rawScore = scores[id];
    if (rawScore == null) continue;
    const score = clamp01(rawScore);
    const def = INDICATORS[id];
    if (score < def.surfaceThreshold) continue;
    observations.push({
      id: `obs-${id}`,
      title: def.title,
      summary: def.summary,
      level: def.defaultLevel,
      category: def.category,
      confidence: score,
      whatItMeans: def.whatItMeans,
      whatToDo: def.whatToDo,
      learnMoreSlug: def.learnMoreSlug,
    });
  }
  return observations;
}

export function mapScoresToResult(
  scores: ModelScores,
  options: { capturedAt: number },
): AnalysisResult {
  const observations = mapScoresToObservations(scores);
  return {
    id: makeId(),
    createdAt: new Date(options.capturedAt).toISOString(),
    source: 'on-device',
    isDemo: false,
    summary: observations.length
      ? 'These observations reflect visible features in your photo. They are not a diagnosis.'
      : 'Nothing specific stood out. This is not a clean bill of health — keep up regular checkups.',
    observations,
    wellness: GENERAL_WELLNESS_SIGNALS,
    nextSteps: [
      'Treat this as an educational prompt, not a diagnosis.',
      'Share anything that concerns you with a dentist or doctor.',
      'Keep up daily cleaning and routine dental checkups.',
    ],
  };
}

export function createModelAnalyzer(runner: OralModelRunner): OralAnalyzer {
  return {
    source: 'on-device',
    isDemo: false,
    async analyze(input: AnalysisInput): Promise<AnalysisResult> {
      if (!runner.isAvailable()) {
        throw new Error(`Oral model "${runner.modelId}" is not available on this device.`);
      }
      const scores = await runner.run(input);
      return mapScoresToResult(scores, { capturedAt: input.capturedAt });
    },
  };
}

/**
 * Default placeholder runner: no model is bundled yet, so it never activates.
 * Replace with a TFLite / ONNX / Core ML wrapper and register via `setAnalyzer`
 * once a validated Phase 1 model exists.
 */
export const unavailableModelRunner: OralModelRunner = {
  modelId: 'none',
  isAvailable: () => false,
  run: async () => ({}),
};
