import { INDICATOR_IDS, TAXONOMY_VERSION } from '@/analysis/taxonomy';

import type { DatasetManifest } from './dataset';

/**
 * Registry of data sources for Phase 1. Both tracks are represented as templates;
 * fill in real license/provenance/counts as each source is actually sourced and
 * cleared. Counts stay 0 until data is collected/licensed. These templates are
 * written to pass `validateManifest` so the governance rules are exercised.
 */
export const DATASET_REGISTRY: DatasetManifest[] = [
  {
    id: 'public-template',
    name: 'Public oral-image dataset (template)',
    kind: 'public',
    license: 'TODO: dataset license (e.g. CC-BY-4.0)',
    consentBasis: 'public-license',
    provenance: 'TODO: cite source name + URL + retrieval date',
    taxonomyVersion: TAXONOMY_VERSION,
    indicators: [...INDICATOR_IDS],
    counts: { train: 0, validation: 0, test: 0 },
    deidentified: true,
    notes: 'Prototype/sanity-check the pipeline. Verify licensing before any redistribution.',
  },
  {
    id: 'clinical-partner-template',
    name: 'Clinical partner dataset (template)',
    kind: 'clinical-partner',
    license: 'partner data-use agreement',
    consentBasis: 'irb-approved-research',
    provenance: 'TODO: partner institution + IRB/ethics approval reference',
    taxonomyVersion: TAXONOMY_VERSION,
    indicators: [...INDICATOR_IDS],
    counts: { train: 0, validation: 0, test: 0 },
    deidentified: true,
    notes:
      'Requires an executed data-use agreement, IRB/ethics approval, and de-identification before ingestion.',
  },
];
