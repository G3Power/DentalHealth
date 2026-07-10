import { describe, expect, it } from '@jest/globals';

import { totalImages, validateManifest, type DatasetManifest } from '@/data/dataset';
import { DATASET_REGISTRY } from '@/data/registry';

function baseManifest(): DatasetManifest {
  return {
    id: 'x',
    name: 'X dataset',
    kind: 'public',
    license: 'CC-BY-4.0',
    consentBasis: 'public-license',
    provenance: 'https://example.org/dataset',
    taxonomyVersion: '2026-07.1',
    indicators: ['tooth-staining'],
    counts: { train: 1, validation: 1, test: 1 },
    deidentified: true,
  };
}

describe('validateManifest', () => {
  it('accepts a valid public manifest', () => {
    expect(validateManifest(baseManifest()).ok).toBe(true);
  });

  it('rejects missing required fields', () => {
    const manifest: DatasetManifest = { ...baseManifest(), id: '', provenance: '' };
    const result = validateManifest(manifest);
    expect(result.ok).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(2);
  });

  it('rejects unknown indicators', () => {
    const manifest: DatasetManifest = {
      ...baseManifest(),
      indicators: ['bogus'] as unknown as DatasetManifest['indicators'],
    };
    expect(validateManifest(manifest).ok).toBe(false);
  });

  it('requires public datasets to use the public-license consent basis', () => {
    const manifest: DatasetManifest = { ...baseManifest(), consentBasis: 'irb-approved-research' };
    expect(validateManifest(manifest).ok).toBe(false);
  });

  it('requires clinical-partner data to be de-identified with non-public consent', () => {
    const manifest: DatasetManifest = {
      ...baseManifest(),
      kind: 'clinical-partner',
      license: 'partner data-use agreement',
      consentBasis: 'irb-approved-research',
      deidentified: false,
    };
    const result = validateManifest(manifest);
    expect(result.ok).toBe(false);
    expect(result.errors.join(' ')).toContain('de-identified');
  });

  it('rejects negative counts', () => {
    const manifest: DatasetManifest = {
      ...baseManifest(),
      counts: { train: -1, validation: 0, test: 0 },
    };
    expect(validateManifest(manifest).ok).toBe(false);
  });
});

describe('DATASET_REGISTRY', () => {
  it('includes both a public and a clinical-partner template, all valid', () => {
    const kinds = DATASET_REGISTRY.map((dataset) => dataset.kind);
    expect(kinds).toContain('public');
    expect(kinds).toContain('clinical-partner');
    for (const manifest of DATASET_REGISTRY) {
      expect(validateManifest(manifest).ok).toBe(true);
    }
  });
});

describe('totalImages', () => {
  it('sums the split counts', () => {
    expect(totalImages(baseManifest())).toBe(3);
  });
});
