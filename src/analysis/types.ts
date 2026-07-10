/**
 * Domain types for the oral self-check analysis layer.
 *
 * IMPORTANT (product + regulatory framing):
 * Nothing in this module is a medical diagnosis. Everything is framed as a
 * non-diagnostic "observation" or educational "wellness signal". The analysis
 * engine is intentionally behind an interface (see `analyzer.ts`) so the current
 * placeholder can be swapped for a real on-device or server model later without
 * touching the UI.
 */

/**
 * How much attention an observation warrants. Deliberately avoids diagnostic /
 * alarming wording. Ordered from least to most attention.
 */
export type ObservationLevel = 'informational' | 'monitor' | 'seek-care';

export type ObservationCategory =
  | 'gums'
  | 'teeth'
  | 'soft-tissue'
  | 'hygiene'
  | 'other';

export interface Observation {
  id: string;
  /** Short, neutral, plain-language title. Never a diagnosis. */
  title: string;
  /** One or two sentences describing what was (or would be) noticed. */
  summary: string;
  level: ObservationLevel;
  category: ObservationCategory;
  /** Model confidence 0..1. Shown to the user to reinforce uncertainty. */
  confidence: number;
  /** Plain-language "what this could relate to" — educational, not conclusive. */
  whatItMeans: string;
  /** Concrete, safe next step (which is almost always "see a professional"). */
  whatToDo: string;
  /** Optional link into the education library. */
  learnMoreSlug?: string;
}

/**
 * Reframing of the original "longevity" idea into an honest, education-first
 * wellness signal. These are NOT predictions about lifespan or disease. They
 * summarise general, population-level associations between oral health and
 * whole-body wellbeing, to motivate good habits and professional care.
 */
export type WellnessStatus = 'supportive' | 'neutral' | 'room-to-improve';

export interface WellnessSignal {
  id: string;
  label: string;
  status: WellnessStatus;
  /** Plain-language explanation of the association. */
  explanation: string;
  /** Where the association comes from, kept honest and non-deterministic. */
  evidenceNote: string;
}

export type AnalysisSource = 'mock' | 'on-device' | 'server';

export interface AnalysisInput {
  imageUri: string;
  width: number;
  height: number;
  capturedAt: number;
}

export interface AnalysisResult {
  id: string;
  createdAt: string;
  source: AnalysisSource;
  /** True whenever results are illustrative rather than a real analysis. */
  isDemo: boolean;
  /** Short neutral summary line. */
  summary: string;
  observations: Observation[];
  wellness: WellnessSignal[];
  /** Ordered, safe next steps to show under the results. */
  nextSteps: string[];
}
