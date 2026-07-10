import { describe, expect, it } from '@jest/globals';

import {
  checkImageQuality,
  describeIssue,
  MIN_IMAGE_DIMENSION,
  type QualityIssue,
} from '@/capture/quality';

describe('checkImageQuality', () => {
  it('passes a sufficiently large image', () => {
    const report = checkImageQuality({ width: 1080, height: 1440 });
    expect(report.ok).toBe(true);
    expect(report.issues).toHaveLength(0);
    expect(report.evaluated).toContain('too-small');
  });

  it('flags an image below the minimum dimension', () => {
    const report = checkImageQuality({ width: MIN_IMAGE_DIMENSION - 1, height: 1000 });
    expect(report.ok).toBe(false);
    expect(report.issues.map((issue) => issue.code)).toContain('too-small');
  });

  it('treats non-finite dimensions as too small', () => {
    const report = checkImageQuality({ width: Number.NaN, height: 1000 });
    expect(report.ok).toBe(false);
  });

  it('only claims to have evaluated the checks it actually ran', () => {
    const report = checkImageQuality({ width: 1080, height: 1440 });
    expect(report.evaluated).toEqual(['too-small']);
  });
});

describe('describeIssue', () => {
  it('returns a non-empty message for every issue code', () => {
    const codes: QualityIssue[] = ['too-small', 'too-dark', 'too-blurry', 'no-mouth-detected'];
    for (const code of codes) {
      expect(describeIssue(code).length).toBeGreaterThan(0);
    }
  });
});
