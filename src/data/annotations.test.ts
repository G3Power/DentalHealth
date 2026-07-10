import { describe, expect, it } from '@jest/globals';

import type { DatasetManifest } from '@/data/dataset';
import {
  labeledIndicators,
  validateAnnotation,
  validateAnnotationForManifest,
  type ImageAnnotation,
  type Severity,
} from '@/data/annotations';

function baseAnnotation(): ImageAnnotation {
  return {
    imageId: 'img-001',
    datasetId: 'ds-1',
    labels: {
      'gingival-inflammation': { present: true, severity: 'moderate' },
      'plaque-tartar': { present: false },
    },
    group: 'fitzpatrick-3',
  };
}

describe('validateAnnotation', () => {
  it('accepts a well-formed annotation', () => {
    expect(validateAnnotation(baseAnnotation())).toEqual({ ok: true, errors: [] });
  });

  it('requires imageId and datasetId', () => {
    const result = validateAnnotation({ ...baseAnnotation(), imageId: ' ', datasetId: '' });
    expect(result.ok).toBe(false);
    expect(result.errors).toContain('imageId is required');
    expect(result.errors).toContain('datasetId is required');
  });

  it('rejects unknown indicator keys', () => {
    const annotation = baseAnnotation();
    annotation.labels = { 'not-real': { present: true } } as ImageAnnotation['labels'];
    const result = validateAnnotation(annotation);
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.includes('unknown indicator'))).toBe(true);
  });

  it('rejects an invalid severity', () => {
    const annotation = baseAnnotation();
    annotation.labels = {
      'tooth-staining': { present: true, severity: 'extreme' as Severity },
    };
    const result = validateAnnotation(annotation);
    expect(result.errors.some((e) => e.includes('invalid severity'))).toBe(true);
  });

  it('rejects severity on an absent indicator', () => {
    const annotation = baseAnnotation();
    annotation.labels = { 'tooth-staining': { present: false, severity: 'mild' } };
    const result = validateAnnotation(annotation);
    expect(result.errors.some((e) => e.includes('only valid when present is true'))).toBe(true);
  });

  it('enforces required indicator coverage', () => {
    const result = validateAnnotation(baseAnnotation(), {
      requiredIndicators: ['gingival-inflammation', 'tooth-staining'],
    });
    expect(result.ok).toBe(false);
    expect(result.errors).toContain('missing required label: tooth-staining');
  });
});

describe('labeledIndicators', () => {
  it('returns the labeled indicators in taxonomy order', () => {
    expect(labeledIndicators(baseAnnotation())).toEqual([
      'gingival-inflammation',
      'plaque-tartar',
    ]);
  });
});

describe('validateAnnotationForManifest', () => {
  const manifest: DatasetManifest = {
    id: 'ds-1',
    name: 'Test dataset',
    kind: 'public',
    license: 'CC-BY-4.0',
    consentBasis: 'public-license',
    provenance: 'unit test',
    taxonomyVersion: '2026-07.1',
    indicators: ['gingival-inflammation', 'plaque-tartar'],
    counts: { train: 0, validation: 0, test: 0 },
    deidentified: true,
  };

  it('passes when the annotation matches the manifest', () => {
    expect(validateAnnotationForManifest(baseAnnotation(), manifest).ok).toBe(true);
  });

  it('flags a datasetId that does not match the manifest', () => {
    const result = validateAnnotationForManifest(
      { ...baseAnnotation(), datasetId: 'other' },
      manifest,
    );
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.includes('does not match manifest'))).toBe(true);
  });

  it('requires every indicator the manifest advertises', () => {
    const annotation = baseAnnotation();
    annotation.labels = { 'gingival-inflammation': { present: true } };
    const result = validateAnnotationForManifest(annotation, manifest);
    expect(result.errors).toContain('missing required label: plaque-tartar');
  });
});
