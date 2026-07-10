import { clamp01 } from '@/lib/clamp';

/**
 * Binary-classification evaluation for a single indicator.
 *
 * This is the "before anything ships" evaluation harness promised in the README:
 * pure, dependency-free functions that turn scored predictions + ground truth
 * into the metrics we committed to reporting (sensitivity/specificity,
 * calibration, discrimination). It carries no data and no model — it is the
 * measuring instrument that a Phase 1 model must pass through before release.
 *
 * Metrics return `null` when they are mathematically undefined for the given
 * sample (e.g. sensitivity with zero actual positives) rather than `NaN`, so
 * callers must handle "not measurable" explicitly instead of silently charting
 * a bogus number.
 */
export interface Prediction {
  /** Model score / probability in 0..1 that the indicator is present. */
  score: number;
  /** Ground-truth presence for this sample. */
  truth: boolean;
  /** Optional subgroup label (e.g. a demographic bucket) for fairness analysis. */
  group?: string;
}

export interface ConfusionCounts {
  truePositive: number;
  falsePositive: number;
  trueNegative: number;
  falseNegative: number;
}

function ratio(numerator: number, denominator: number): number | null {
  return denominator === 0 ? null : numerator / denominator;
}

/** Tally predictions into a confusion matrix at a decision threshold (score >= t). */
export function confusionAtThreshold(
  predictions: readonly Prediction[],
  threshold: number,
): ConfusionCounts {
  const counts: ConfusionCounts = {
    truePositive: 0,
    falsePositive: 0,
    trueNegative: 0,
    falseNegative: 0,
  };
  for (const { score, truth } of predictions) {
    const predictedPositive = score >= threshold;
    if (predictedPositive && truth) counts.truePositive++;
    else if (predictedPositive && !truth) counts.falsePositive++;
    else if (!predictedPositive && truth) counts.falseNegative++;
    else counts.trueNegative++;
  }
  return counts;
}

/** True-positive rate (recall). Undefined with no actual positives. */
export function sensitivity(c: ConfusionCounts): number | null {
  return ratio(c.truePositive, c.truePositive + c.falseNegative);
}

/** True-negative rate. Undefined with no actual negatives. */
export function specificity(c: ConfusionCounts): number | null {
  return ratio(c.trueNegative, c.trueNegative + c.falsePositive);
}

/** Positive predictive value. Undefined with no predicted positives. */
export function precision(c: ConfusionCounts): number | null {
  return ratio(c.truePositive, c.truePositive + c.falsePositive);
}

export function accuracy(c: ConfusionCounts): number | null {
  const total = c.truePositive + c.falsePositive + c.trueNegative + c.falseNegative;
  return ratio(c.truePositive + c.trueNegative, total);
}

export function f1Score(c: ConfusionCounts): number | null {
  const p = precision(c);
  const r = sensitivity(c);
  if (p === null || r === null || p + r === 0) return null;
  return (2 * p * r) / (p + r);
}

export interface CalibrationBin {
  /** Mean predicted score for samples in this bin. */
  meanConfidence: number;
  /** Observed positive rate for samples in this bin. */
  meanAccuracy: number;
  count: number;
}

/**
 * Brier score: mean squared error between predicted probability and outcome
 * (0..1, lower is better-calibrated). Undefined for an empty set.
 */
export function brierScore(predictions: readonly Prediction[]): number | null {
  if (predictions.length === 0) return null;
  let sum = 0;
  for (const { score, truth } of predictions) {
    const p = clamp01(score);
    const outcome = truth ? 1 : 0;
    sum += (p - outcome) ** 2;
  }
  return sum / predictions.length;
}

/** Equal-width reliability bins over [0,1]; empty bins are omitted. */
export function reliabilityBins(
  predictions: readonly Prediction[],
  bins = 10,
): CalibrationBin[] {
  if (bins < 1) return [];
  const confidenceSum = new Array<number>(bins).fill(0);
  const positiveCount = new Array<number>(bins).fill(0);
  const total = new Array<number>(bins).fill(0);

  for (const { score, truth } of predictions) {
    const p = clamp01(score);
    const index = Math.min(bins - 1, Math.floor(p * bins));
    confidenceSum[index] += p;
    if (truth) positiveCount[index]++;
    total[index]++;
  }

  const result: CalibrationBin[] = [];
  for (let i = 0; i < bins; i++) {
    if (total[i] === 0) continue;
    result.push({
      meanConfidence: confidenceSum[i] / total[i],
      meanAccuracy: positiveCount[i] / total[i],
      count: total[i],
    });
  }
  return result;
}

/**
 * Expected Calibration Error: sample-weighted mean gap between confidence and
 * accuracy across bins (0..1, lower is better). Undefined for an empty set.
 */
export function expectedCalibrationError(
  predictions: readonly Prediction[],
  bins = 10,
): number | null {
  if (predictions.length === 0 || bins < 1) return null;
  let ece = 0;
  for (const bin of reliabilityBins(predictions, bins)) {
    ece += (bin.count / predictions.length) * Math.abs(bin.meanAccuracy - bin.meanConfidence);
  }
  return ece;
}

/**
 * ROC AUC via the Mann–Whitney U statistic (average ranks for ties). Equals the
 * probability a random positive is scored above a random negative. Undefined
 * unless both classes are present.
 */
export function rocAuc(predictions: readonly Prediction[]): number | null {
  const positives = predictions.filter((p) => p.truth).length;
  const negatives = predictions.length - positives;
  if (positives === 0 || negatives === 0) return null;

  const sorted = predictions
    .map((p) => ({ score: clamp01(p.score), truth: p.truth }))
    .sort((a, b) => a.score - b.score);

  const ranks = new Array<number>(sorted.length);
  let i = 0;
  while (i < sorted.length) {
    let j = i;
    while (j + 1 < sorted.length && sorted[j + 1].score === sorted[i].score) j++;
    const averageRank = (i + j) / 2 + 1; // ranks are 1-based
    for (let k = i; k <= j; k++) ranks[k] = averageRank;
    i = j + 1;
  }

  let rankSumPositive = 0;
  for (let k = 0; k < sorted.length; k++) {
    if (sorted[k].truth) rankSumPositive += ranks[k];
  }
  return (rankSumPositive - (positives * (positives + 1)) / 2) / (positives * negatives);
}

export interface IndicatorEvaluation {
  threshold: number;
  count: number;
  confusion: ConfusionCounts;
  sensitivity: number | null;
  specificity: number | null;
  precision: number | null;
  f1: number | null;
  accuracy: number | null;
  brier: number | null;
  expectedCalibrationError: number | null;
  rocAuc: number | null;
}

export interface EvaluateOptions {
  threshold?: number;
  calibrationBins?: number;
}

/** One-call bundle of every metric above for a set of predictions. */
export function evaluateIndicator(
  predictions: readonly Prediction[],
  options: EvaluateOptions = {},
): IndicatorEvaluation {
  const threshold = options.threshold ?? 0.5;
  const bins = options.calibrationBins ?? 10;
  const confusion = confusionAtThreshold(predictions, threshold);
  return {
    threshold,
    count: predictions.length,
    confusion,
    sensitivity: sensitivity(confusion),
    specificity: specificity(confusion),
    precision: precision(confusion),
    f1: f1Score(confusion),
    accuracy: accuracy(confusion),
    brier: brierScore(predictions),
    expectedCalibrationError: expectedCalibrationError(predictions, bins),
    rocAuc: rocAuc(predictions),
  };
}
