import { describe, expect, it } from '@jest/globals';

import {
  checkImageQuality,
  checkImageQualityDetailed,
  computeBrightness,
  computeSharpness,
  describeIssue,
  MIN_IMAGE_DIMENSION,
  type QualityIssue,
} from '@/capture/quality';

/** Build a WxH checkerboard of 0/255 luma values (high contrast, "sharp"). */
function checkerboard(width: number, height: number): number[] {
  const pixels: number[] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      pixels.push((x + y) % 2 === 0 ? 255 : 0);
    }
  }
  return pixels;
}

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

describe('computeBrightness', () => {
  it('returns 0 for a black image and 1 for a white image', () => {
    expect(computeBrightness([0, 0, 0, 0])).toBe(0);
    expect(computeBrightness([255, 255, 255, 255])).toBe(1);
  });

  it('returns the normalized mean for a mixed image', () => {
    expect(computeBrightness([0, 255])).toBeCloseTo(0.5);
  });

  it('returns 0 for an empty buffer', () => {
    expect(computeBrightness([])).toBe(0);
  });
});

describe('computeSharpness', () => {
  it('is 0 for a uniform image', () => {
    const uniform = new Array(16).fill(128);
    expect(computeSharpness(uniform, 4, 4)).toBe(0);
  });

  it('is high for a high-contrast checkerboard', () => {
    expect(computeSharpness(checkerboard(4, 4), 4, 4)).toBeGreaterThan(0.5);
  });
});

describe('checkImageQualityDetailed', () => {
  it('passes a bright, sharp, high-resolution image', () => {
    const report = checkImageQualityDetailed({
      width: 1080,
      height: 1440,
      luma: checkerboard(8, 8),
      lumaWidth: 8,
      lumaHeight: 8,
    });
    expect(report.ok).toBe(true);
    expect(report.evaluated).toEqual(expect.arrayContaining(['too-small', 'too-dark', 'too-blurry']));
  });

  it('flags a dark, blurry (uniform) image', () => {
    const report = checkImageQualityDetailed({
      width: 1080,
      height: 1440,
      luma: new Array(64).fill(5),
      lumaWidth: 8,
      lumaHeight: 8,
    });
    expect(report.ok).toBe(false);
    const codes = report.issues.map((issue) => issue.code);
    expect(codes).toContain('too-dark');
    expect(codes).toContain('too-blurry');
  });
});
