import {
  confusionAtThreshold,
  f1Score,
  precision,
  sensitivity,
  specificity,
  type Prediction,
} from './metrics';

/**
 * Cross-subgroup evaluation — the health-equity half of the plan.
 *
 * Aggregate accuracy can hide that a model works well for one group and poorly
 * for another. These helpers break metrics out per subgroup (e.g. by skin tone
 * or demographic bucket) and quantify the worst disparity, so an unacceptable
 * fairness gap blocks release the same way a low overall score would.
 */
export interface SubgroupMetric {
  group: string;
  count: number;
  sensitivity: number | null;
  specificity: number | null;
  precision: number | null;
  f1: number | null;
}

export type SubgroupMetricKey = 'sensitivity' | 'specificity' | 'precision' | 'f1';

const UNGROUPED = 'ungrouped';

/** Per-subgroup metrics at a decision threshold, sorted by group name. */
export function subgroupMetrics(
  predictions: readonly Prediction[],
  threshold = 0.5,
): SubgroupMetric[] {
  const byGroup = new Map<string, Prediction[]>();
  for (const prediction of predictions) {
    const key = prediction.group ?? UNGROUPED;
    const bucket = byGroup.get(key);
    if (bucket) bucket.push(prediction);
    else byGroup.set(key, [prediction]);
  }

  return [...byGroup.entries()]
    .map(([group, groupPredictions]) => {
      const confusion = confusionAtThreshold(groupPredictions, threshold);
      return {
        group,
        count: groupPredictions.length,
        sensitivity: sensitivity(confusion),
        specificity: specificity(confusion),
        precision: precision(confusion),
        f1: f1Score(confusion),
      };
    })
    .sort((a, b) => a.group.localeCompare(b.group));
}

/**
 * Largest disparity between the max and min of a set of metric values, ignoring
 * `null` (unmeasurable) groups. Undefined with fewer than two measurable values.
 */
export function fairnessGap(values: readonly (number | null)[]): number | null {
  const defined = values.filter((value): value is number => value !== null);
  if (defined.length < 2) return null;
  return Math.max(...defined) - Math.min(...defined);
}

/** Fairness gap for one metric across already-computed subgroup metrics. */
export function subgroupGap(
  groups: readonly SubgroupMetric[],
  metric: SubgroupMetricKey,
): number | null {
  return fairnessGap(groups.map((group) => group[metric]));
}
