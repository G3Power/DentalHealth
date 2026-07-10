import { assertNever } from '@/lib/assert-never';

/**
 * On-device image quality gate.
 *
 * Phase 0 performs ONE real check — a minimum resolution check using the
 * dimensions returned by the camera. The remaining checks (lighting, blur, and
 * "is a mouth actually in frame") are the natural next seams: they need pixel
 * access / a lightweight detector and will be added in Phase 1. They are listed
 * here as `QualityIssue` codes so the UI and types are ready, but we do not
 * pretend to evaluate them yet.
 */

export type QualityIssue = 'too-small' | 'too-dark' | 'too-blurry' | 'no-mouth-detected';

export interface QualityIssueInfo {
  code: QualityIssue;
  message: string;
}

export interface ImageQualityReport {
  ok: boolean;
  issues: QualityIssueInfo[];
  /** Codes we actually evaluated this run (for transparency in the UI/logs). */
  evaluated: QualityIssue[];
}

export const MIN_IMAGE_DIMENSION = 480;

/** Heuristic thresholds for the luma-based checks (0..1). Tune with real data. */
export const MIN_BRIGHTNESS = 0.22;
export const MIN_SHARPNESS = 0.04;

export function describeIssue(code: QualityIssue): string {
  switch (code) {
    case 'too-small':
      return `The photo resolution is low. Move a little closer and try again.`;
    case 'too-dark':
      return `The photo looks dark. Find brighter, even lighting.`;
    case 'too-blurry':
      return `The photo looks blurry. Hold steady and let the camera focus.`;
    case 'no-mouth-detected':
      return `We could not clearly see a mouth. Frame your open mouth in the guide.`;
    default:
      return assertNever(code);
  }
}

export interface QualityInput {
  width: number;
  height: number;
}

export function checkImageQuality({ width, height }: QualityInput): ImageQualityReport {
  const evaluated: QualityIssue[] = ['too-small'];
  const issues: QualityIssueInfo[] = [];

  const smallestSide = Math.min(width, height);
  if (!Number.isFinite(smallestSide) || smallestSide < MIN_IMAGE_DIMENSION) {
    issues.push({ code: 'too-small', message: describeIssue('too-small') });
  }

  return { ok: issues.length === 0, issues, evaluated };
}

/** Mean luminance normalized to 0..1. `luma` holds 8-bit grayscale values. */
export function computeBrightness(luma: ArrayLike<number>): number {
  if (luma.length === 0) return 0;
  let sum = 0;
  for (let i = 0; i < luma.length; i++) sum += luma[i];
  return sum / luma.length / 255;
}

/**
 * Sharpness estimate via mean absolute gradient between neighboring pixels,
 * normalized to 0..1. A uniform (blank/blurry) image trends to 0; a crisp,
 * high-contrast image trends higher. Cheap and dependency-free.
 */
export function computeSharpness(
  luma: ArrayLike<number>,
  width: number,
  height: number,
): number {
  if (width < 2 || height < 2 || luma.length < width * height) return 0;
  let total = 0;
  let count = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      if (x + 1 < width) {
        total += Math.abs(luma[i] - luma[i + 1]);
        count++;
      }
      if (y + 1 < height) {
        total += Math.abs(luma[i] - luma[i + width]);
        count++;
      }
    }
  }
  return count === 0 ? 0 : total / count / 255;
}

export interface DetailedQualityInput extends QualityInput {
  /** Grayscale pixels (row-major), typically from a downsampled capture. */
  luma: ArrayLike<number>;
  lumaWidth: number;
  lumaHeight: number;
}

/**
 * Resolution + brightness + sharpness. Used once a platform pixel source is wired
 * up (the remaining seam: decoding the captured photo to a luma buffer — trivial on
 * web via canvas, needs a decode step on native). Mouth-presence detection stays a
 * model-backed seam handled by the Phase 1 classifier.
 */
export function checkImageQualityDetailed(input: DetailedQualityInput): ImageQualityReport {
  const base = checkImageQuality({ width: input.width, height: input.height });
  const evaluated: QualityIssue[] = [...base.evaluated, 'too-dark', 'too-blurry'];
  const issues: QualityIssueInfo[] = [...base.issues];

  if (computeBrightness(input.luma) < MIN_BRIGHTNESS) {
    issues.push({ code: 'too-dark', message: describeIssue('too-dark') });
  }
  if (computeSharpness(input.luma, input.lumaWidth, input.lumaHeight) < MIN_SHARPNESS) {
    issues.push({ code: 'too-blurry', message: describeIssue('too-blurry') });
  }

  return { ok: issues.length === 0, issues, evaluated };
}
