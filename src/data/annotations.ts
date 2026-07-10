import { INDICATOR_IDS, isIndicatorId, type IndicatorId } from '@/analysis/taxonomy';
import type { DatasetManifest, ValidationResult } from './dataset';

/**
 * Per-image ground-truth label contract.
 *
 * A `DatasetManifest` (see `dataset.ts`) describes a *source*; an
 * `ImageAnnotation` describes a *single labeled image* within it. This is the
 * truth that both trains a model and feeds the evaluator's `truth` field — so it
 * is deliberately typed against the same `taxonomy.ts` indicators as the model
 * output, and validated before ingestion.
 */
export type Severity = 'mild' | 'moderate' | 'severe';

export const SEVERITIES: Severity[] = ['mild', 'moderate', 'severe'];

export function isSeverity(value: string): value is Severity {
  return (SEVERITIES as string[]).includes(value);
}

export interface IndicatorLabel {
  present: boolean;
  /** Only meaningful when `present`; omit for absent indicators. */
  severity?: Severity;
}

export interface ImageAnnotation {
  imageId: string;
  datasetId: string;
  /** Per-indicator ground truth. Keys must be valid taxonomy indicators. */
  labels: Partial<Record<IndicatorId, IndicatorLabel>>;
  /** Optional subgroup bucket (e.g. a skin-tone scale) for fairness slicing. */
  group?: string;
  /** Provenance of the label: annotator id, adjudication method, etc. */
  annotatedBy?: string;
}

export interface AnnotationValidationOptions {
  /** Indicators that MUST be labeled (typically a manifest's `indicators`). */
  requiredIndicators?: IndicatorId[];
}

/** Indicators actually labeled on this annotation, in taxonomy order. */
export function labeledIndicators(annotation: ImageAnnotation): IndicatorId[] {
  return INDICATOR_IDS.filter((id) => annotation.labels[id] !== undefined);
}

export function validateAnnotation(
  annotation: ImageAnnotation,
  options: AnnotationValidationOptions = {},
): ValidationResult {
  const errors: string[] = [];

  if (!annotation.imageId.trim()) errors.push('imageId is required');
  if (!annotation.datasetId.trim()) errors.push('datasetId is required');

  for (const [key, label] of Object.entries(annotation.labels)) {
    if (!isIndicatorId(key)) {
      errors.push(`unknown indicator: ${key}`);
      continue;
    }
    if (!label || typeof label.present !== 'boolean') {
      errors.push(`${key}: present (boolean) is required`);
      continue;
    }
    if (label.severity !== undefined) {
      if (!isSeverity(label.severity)) {
        errors.push(`${key}: invalid severity "${label.severity}"`);
      } else if (!label.present) {
        errors.push(`${key}: severity is only valid when present is true`);
      }
    }
  }

  for (const required of options.requiredIndicators ?? []) {
    if (annotation.labels[required] === undefined) {
      errors.push(`missing required label: ${required}`);
    }
  }

  return { ok: errors.length === 0, errors };
}

/**
 * Validate an annotation against the manifest it claims to belong to: the
 * dataset id must match, and every indicator the manifest advertises must be
 * labeled. Keeps a dataset internally consistent before it is ingested.
 */
export function validateAnnotationForManifest(
  annotation: ImageAnnotation,
  manifest: DatasetManifest,
): ValidationResult {
  const base = validateAnnotation(annotation, { requiredIndicators: manifest.indicators });
  const errors = [...base.errors];

  if (annotation.datasetId !== manifest.id) {
    errors.push(`datasetId "${annotation.datasetId}" does not match manifest "${manifest.id}"`);
  }

  return { ok: errors.length === 0, errors };
}
