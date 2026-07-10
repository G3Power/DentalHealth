import { describe, expect, it } from '@jest/globals';

import {
  accuracy,
  brierScore,
  confusionAtThreshold,
  evaluateIndicator,
  expectedCalibrationError,
  f1Score,
  precision,
  reliabilityBins,
  rocAuc,
  sensitivity,
  specificity,
  type Prediction,
} from '@/eval/metrics';

// One TP, one FP, one FN, one TN at threshold 0.5.
const balanced: Prediction[] = [
  { score: 0.9, truth: true },
  { score: 0.7, truth: false },
  { score: 0.3, truth: true },
  { score: 0.1, truth: false },
];

describe('confusionAtThreshold', () => {
  it('tallies each quadrant at the threshold', () => {
    expect(confusionAtThreshold(balanced, 0.5)).toEqual({
      truePositive: 1,
      falsePositive: 1,
      trueNegative: 1,
      falseNegative: 1,
    });
  });

  it('uses a >= comparison so a score exactly on the threshold predicts positive', () => {
    const c = confusionAtThreshold([{ score: 0.5, truth: true }], 0.5);
    expect(c.truePositive).toBe(1);
  });
});

describe('scalar metrics', () => {
  it('computes the textbook values for the balanced case', () => {
    const c = confusionAtThreshold(balanced, 0.5);
    expect(sensitivity(c)).toBeCloseTo(0.5);
    expect(specificity(c)).toBeCloseTo(0.5);
    expect(precision(c)).toBeCloseTo(0.5);
    expect(accuracy(c)).toBeCloseTo(0.5);
    expect(f1Score(c)).toBeCloseTo(0.5);
  });

  it('returns null (not NaN) when a metric is undefined', () => {
    const allNegatives = confusionAtThreshold(
      [
        { score: 0.9, truth: false },
        { score: 0.1, truth: false },
      ],
      0.5,
    );
    expect(sensitivity(allNegatives)).toBeNull(); // no actual positives
    expect(precision(allNegatives)).not.toBeNull();

    const noPredictedPositives = confusionAtThreshold(
      [{ score: 0.1, truth: true }],
      0.5,
    );
    expect(precision(noPredictedPositives)).toBeNull();
    expect(f1Score(noPredictedPositives)).toBeNull();

    const allPositives = confusionAtThreshold([{ score: 0.9, truth: true }], 0.5);
    expect(specificity(allPositives)).toBeNull();
  });
});

describe('brierScore', () => {
  it('is 0 for perfectly confident, correct predictions', () => {
    expect(
      brierScore([
        { score: 1, truth: true },
        { score: 0, truth: false },
      ]),
    ).toBe(0);
  });

  it('is 1 for a perfectly confident, wrong prediction', () => {
    expect(brierScore([{ score: 1, truth: false }])).toBe(1);
  });

  it('clamps out-of-range scores', () => {
    expect(brierScore([{ score: 1.5, truth: true }])).toBe(0);
  });

  it('is null for an empty set', () => {
    expect(brierScore([])).toBeNull();
  });
});

describe('calibration', () => {
  it('omits empty bins and reports per-bin confidence/accuracy', () => {
    const bins = reliabilityBins(
      [
        { score: 0.95, truth: true },
        { score: 0.05, truth: false },
      ],
      10,
    );
    expect(bins).toHaveLength(2);
    expect(bins.reduce((sum, b) => sum + b.count, 0)).toBe(2);
  });

  it('has zero ECE when confidence matches outcomes', () => {
    expect(
      expectedCalibrationError([
        { score: 1, truth: true },
        { score: 0, truth: false },
      ]),
    ).toBeCloseTo(0);
  });

  it('surfaces overconfidence as a nonzero ECE', () => {
    expect(expectedCalibrationError([{ score: 0.9, truth: false }])).toBeCloseTo(0.9);
  });

  it('is null for an empty set', () => {
    expect(expectedCalibrationError([])).toBeNull();
  });
});

describe('rocAuc', () => {
  it('is 1 for perfect separation', () => {
    expect(
      rocAuc([
        { score: 0.9, truth: true },
        { score: 0.8, truth: true },
        { score: 0.2, truth: false },
        { score: 0.1, truth: false },
      ]),
    ).toBe(1);
  });

  it('is 0 when the ranking is fully reversed', () => {
    expect(
      rocAuc([
        { score: 0.1, truth: true },
        { score: 0.2, truth: true },
        { score: 0.8, truth: false },
        { score: 0.9, truth: false },
      ]),
    ).toBe(0);
  });

  it('is 0.5 for a tie between one positive and one negative', () => {
    expect(
      rocAuc([
        { score: 0.5, truth: true },
        { score: 0.5, truth: false },
      ]),
    ).toBeCloseTo(0.5);
  });

  it('is null without both classes present', () => {
    expect(
      rocAuc([
        { score: 0.9, truth: true },
        { score: 0.8, truth: true },
      ]),
    ).toBeNull();
  });
});

describe('evaluateIndicator', () => {
  it('bundles every metric and defaults the threshold to 0.5', () => {
    const evaluation = evaluateIndicator(balanced);
    expect(evaluation.threshold).toBe(0.5);
    expect(evaluation.count).toBe(4);
    expect(evaluation.sensitivity).toBeCloseTo(0.5);
    expect(evaluation.rocAuc).not.toBeNull();
    expect(evaluation.brier).not.toBeNull();
  });
});
