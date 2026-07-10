import type { ObservationCategory, ObservationLevel } from './types';

/**
 * Phase 1 label taxonomy — the single shared contract between:
 *   - dataset labels (what images are annotated for),
 *   - model outputs (what the classifier predicts), and
 *   - UI observations (what the user sees).
 *
 * Scope is deliberately limited to lower-risk, *visible* indicators. Higher-stakes
 * targets (e.g. soft-tissue lesions / oral-cancer signs) are intentionally NOT in
 * the Phase 1 detection set — those belong to Phase 2 with clinical validation.
 * Bump `TAXONOMY_VERSION` whenever the label set changes so datasets/models can
 * assert compatibility.
 */
export type IndicatorId = 'gingival-inflammation' | 'plaque-tartar' | 'tooth-staining';

export const TAXONOMY_VERSION = '2026-07.1';

export interface IndicatorDef {
  id: IndicatorId;
  title: string;
  category: ObservationCategory;
  defaultLevel: ObservationLevel;
  learnMoreSlug?: string;
  summary: string;
  whatItMeans: string;
  whatToDo: string;
  /** Minimum model score (0..1) at which we surface this as an observation. */
  surfaceThreshold: number;
}

export const INDICATORS: Record<IndicatorId, IndicatorDef> = {
  'gingival-inflammation': {
    id: 'gingival-inflammation',
    title: 'Possible gum inflammation',
    category: 'gums',
    defaultLevel: 'monitor',
    learnMoreSlug: 'gum-health',
    summary: 'Gums that look red or swollen can be a sign of early irritation.',
    whatItMeans:
      'Redness and puffiness are often linked to early, usually reversible gum inflammation (gingivitis).',
    whatToDo:
      'Improve daily cleaning and mention it at your next dental visit; book sooner if gums bleed often or stay sore.',
    surfaceThreshold: 0.5,
  },
  'plaque-tartar': {
    id: 'plaque-tartar',
    title: 'Possible plaque or tartar build-up',
    category: 'hygiene',
    defaultLevel: 'informational',
    learnMoreSlug: 'daily-care',
    summary: 'A soft film or hardened deposit can collect where teeth meet the gums.',
    whatItMeans:
      'Plaque is an everyday build-up of bacteria; hardened tartar needs professional removal.',
    whatToDo:
      'Brush and clean between your teeth daily. A routine dental cleaning removes what brushing cannot.',
    surfaceThreshold: 0.5,
  },
  'tooth-staining': {
    id: 'tooth-staining',
    title: 'Noticeable tooth staining',
    category: 'teeth',
    defaultLevel: 'informational',
    learnMoreSlug: 'daily-care',
    summary: 'Some surfaces look darker or more yellow than others.',
    whatItMeans:
      'Staining is often cosmetic (coffee, tea, tobacco) but can sometimes accompany other issues.',
    whatToDo:
      'A dentist can distinguish surface staining from things that need treatment and advise on safe options.',
    surfaceThreshold: 0.5,
  },
};

export const INDICATOR_IDS = Object.keys(INDICATORS) as IndicatorId[];

export function isIndicatorId(value: string): value is IndicatorId {
  return Object.prototype.hasOwnProperty.call(INDICATORS, value);
}
