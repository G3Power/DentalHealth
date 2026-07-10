import { describe, expect, it } from '@jest/globals';

import { fitScale, rgbaToLuma } from '@/capture/luma';

describe('rgbaToLuma', () => {
  it('maps pure white to 255 and pure black to 0', () => {
    const rgba = [255, 255, 255, 255, 0, 0, 0, 255];
    expect(rgbaToLuma(rgba)).toEqual([255, 0]);
  });

  it('weights green above red above blue (Rec. 601)', () => {
    const [green] = rgbaToLuma([0, 255, 0, 255]);
    const [red] = rgbaToLuma([255, 0, 0, 255]);
    const [blue] = rgbaToLuma([0, 0, 255, 255]);
    expect(green).toBeGreaterThan(red);
    expect(red).toBeGreaterThan(blue);
  });

  it('ignores the alpha channel', () => {
    expect(rgbaToLuma([100, 100, 100, 0])).toEqual([100]);
    expect(rgbaToLuma([100, 100, 100, 255])).toEqual([100]);
  });

  it('produces one luma value per pixel', () => {
    const fivePixels = new Array<number>(4 * 5).fill(0);
    expect(rgbaToLuma(fivePixels)).toHaveLength(5);
  });

  it('floors trailing bytes that do not complete a pixel', () => {
    expect(rgbaToLuma([255, 255, 255, 255, 10, 10])).toHaveLength(1);
  });
});

describe('fitScale', () => {
  it('never upscales images already within the cap', () => {
    expect(fitScale(64, 48, 128)).toBe(1);
  });

  it('scales the longest side down to the cap', () => {
    expect(fitScale(256, 128, 128)).toBeCloseTo(0.5);
  });

  it('is defensive against degenerate inputs', () => {
    expect(fitScale(0, 0, 128)).toBe(1);
    expect(fitScale(100, 100, 0)).toBe(1);
  });
});
