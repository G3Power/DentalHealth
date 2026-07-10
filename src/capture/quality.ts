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
