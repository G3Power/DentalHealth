import { describe, expect, it } from '@jest/globals';

import type { Prediction } from '@/eval/metrics';
import { fairnessGap, subgroupGap, subgroupMetrics } from '@/eval/fairness';

// Group A predicts perfectly; group B is fully wrong — a stark disparity.
const predictions: Prediction[] = [
  { score: 0.9, truth: true, group: 'A' },
  { score: 0.1, truth: false, group: 'A' },
  { score: 0.1, truth: true, group: 'B' },
  { score: 0.9, truth: false, group: 'B' },
];

describe('subgroupMetrics', () => {
  it('buckets by group, counts, and sorts by group name', () => {
    const groups = subgroupMetrics(predictions, 0.5);
    expect(groups.map((g) => g.group)).toEqual(['A', 'B']);
    expect(groups.every((g) => g.count === 2)).toBe(true);
  });

  it('measures each subgroup independently', () => {
    const [a, b] = subgroupMetrics(predictions, 0.5);
    expect(a.sensitivity).toBeCloseTo(1);
    expect(a.specificity).toBeCloseTo(1);
    expect(b.sensitivity).toBeCloseTo(0);
    expect(b.specificity).toBeCloseTo(0);
  });

  it('labels predictions without a group as "ungrouped"', () => {
    const groups = subgroupMetrics([{ score: 0.9, truth: true }], 0.5);
    expect(groups[0].group).toBe('ungrouped');
  });
});

describe('fairnessGap', () => {
  it('is the spread between the best and worst value', () => {
    expect(fairnessGap([0.9, 0.6, 0.75])).toBeCloseTo(0.3);
  });

  it('ignores unmeasurable (null) groups', () => {
    expect(fairnessGap([0.8, null, 0.5])).toBeCloseTo(0.3);
  });

  it('is null with fewer than two measurable values', () => {
    expect(fairnessGap([0.8])).toBeNull();
    expect(fairnessGap([null, null])).toBeNull();
    expect(fairnessGap([])).toBeNull();
  });
});

describe('subgroupGap', () => {
  it('surfaces the disparity for a chosen metric', () => {
    const groups = subgroupMetrics(predictions, 0.5);
    expect(subgroupGap(groups, 'sensitivity')).toBeCloseTo(1);
    expect(subgroupGap(groups, 'specificity')).toBeCloseTo(1);
  });
});
