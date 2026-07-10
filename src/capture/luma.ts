/**
 * Pure pixel helpers shared by every platform pixel source.
 *
 * The platform-specific glue (canvas on web, a decoder on native) lives in
 * `pixels.ts` / `pixels.web.ts`; the math here stays dependency-free and unit
 * tested so the quality checks behave identically wherever the pixels come from.
 */

export interface LumaImage {
  /** Row-major 8-bit grayscale values, one per pixel. */
  luma: number[];
  width: number;
  height: number;
}

export interface ExtractLumaOptions {
  /**
   * Longest-side cap for the decoded buffer. The capture is downsampled to this
   * before analysis: brightness/sharpness only need a coarse buffer, and a small
   * one keeps the work cheap and steadier against sensor noise.
   */
  maxDimension?: number;
}

export const DEFAULT_MAX_LUMA_DIM = 128;

/**
 * Convert packed RGBA bytes to 8-bit luminance using Rec. 601 weights. Alpha is
 * ignored. Returns one value per pixel (input length / 4, floored).
 */
export function rgbaToLuma(rgba: ArrayLike<number>): number[] {
  const pixelCount = Math.floor(rgba.length / 4);
  const luma = new Array<number>(pixelCount);
  for (let i = 0; i < pixelCount; i++) {
    const offset = i * 4;
    const r = rgba[offset];
    const g = rgba[offset + 1];
    const b = rgba[offset + 2];
    luma[i] = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
  }
  return luma;
}

/** Downsample scale so the longest side fits `maxDimension` (never upscales). */
export function fitScale(width: number, height: number, maxDimension: number): number {
  const longest = Math.max(width, height);
  if (longest <= 0 || maxDimension <= 0) return 1;
  return Math.min(1, maxDimension / longest);
}
