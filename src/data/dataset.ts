import { isIndicatorId, type IndicatorId } from '@/analysis/taxonomy';
import { assertNever } from '@/lib/assert-never';

/**
 * Dataset governance layer.
 *
 * We pursue two data tracks in parallel:
 *   - `public`: openly-licensed / research datasets, used to prototype the pipeline.
 *   - `clinical-partner`: data from a dental school / clinic under a data-use
 *      agreement + IRB/ethics approval.
 *
 * A `DatasetManifest` records provenance, license, consent basis, and label
 * coverage for a source. `validateManifest` encodes governance rules so we cannot
 * accidentally ingest a source that is mislabeled or missing consent/de-identification.
 */
export type DatasetKind = 'public' | 'clinical-partner';

export type ConsentBasis =
  | 'public-license'
  | 'irb-approved-research'
  | 'clinical-partner-agreement';

export interface DatasetSplitCounts {
  train: number;
  validation: number;
  test: number;
}

export interface DatasetManifest {
  id: string;
  name: string;
  kind: DatasetKind;
  /** SPDX id or agreement name, e.g. 'CC-BY-4.0' or 'partner data-use agreement'. */
  license: string;
  consentBasis: ConsentBasis;
  /** Where it came from: citation, URL, institution, retrieval date, etc. */
  provenance: string;
  /** Which taxonomy version the labels correspond to. */
  taxonomyVersion: string;
  /** Which indicators are labeled in this dataset. */
  indicators: IndicatorId[];
  counts: DatasetSplitCounts;
  deidentified: boolean;
  notes?: string;
}

export interface ValidationResult {
  ok: boolean;
  errors: string[];
}

export function totalImages(manifest: DatasetManifest): number {
  const { train, validation, test } = manifest.counts;
  return train + validation + test;
}

export function validateManifest(manifest: DatasetManifest): ValidationResult {
  const errors: string[] = [];

  if (!manifest.id.trim()) errors.push('id is required');
  if (!manifest.name.trim()) errors.push('name is required');
  if (!manifest.license.trim()) errors.push('license is required');
  if (!manifest.provenance.trim()) errors.push('provenance is required');
  if (!manifest.taxonomyVersion.trim()) errors.push('taxonomyVersion is required');

  for (const [split, count] of Object.entries(manifest.counts)) {
    if (!Number.isInteger(count) || count < 0) {
      errors.push(`counts.${split} must be a non-negative integer`);
    }
  }

  if (manifest.indicators.length === 0) {
    errors.push('at least one labeled indicator is required');
  }
  for (const indicator of manifest.indicators) {
    if (!isIndicatorId(indicator)) errors.push(`unknown indicator: ${indicator}`);
  }

  switch (manifest.kind) {
    case 'public':
      if (manifest.consentBasis !== 'public-license') {
        errors.push('public datasets must use consentBasis "public-license"');
      }
      break;
    case 'clinical-partner':
      if (manifest.consentBasis === 'public-license') {
        errors.push('clinical-partner datasets need a research or partner consent basis');
      }
      if (!manifest.deidentified) {
        errors.push('clinical-partner datasets must be de-identified before ingestion');
      }
      break;
    default:
      return assertNever(manifest.kind);
  }

  return { ok: errors.length === 0, errors };
}
