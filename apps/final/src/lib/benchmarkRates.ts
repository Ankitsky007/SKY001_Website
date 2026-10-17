import type { StoryRow } from '@skyfall/core'

export type Metric = 'speed' | 'cost' | 'iou'
export const METRICS: Metric[] = ['speed', 'cost', 'iou']

/** Samples per hour and samples per $1 make the longest bar the best one, like accuracy. */
export function metricValue(row: StoryRow, metric: Metric) {
  if (metric === 'speed') return 3600 / row.seconds
  if (metric === 'cost') return 1 / row.cost
  return row.iou
}

/** Three significant figures below 100, whole numbers with thousands commas above ("8.20", "32.7", "2,951"). */
export function formatRate(v: number) {
  return v >= 100 ? Math.round(v).toLocaleString('en-US') : v.toPrecision(3)
}

/** Axis end: the smallest of 1, 1.5, 2, 2.5, 3, 5 (times a power of ten) at or above the largest value. */
export function axisMax(max: number) {
  const p = 10 ** Math.floor(Math.log10(max))
  return ([1, 1.5, 2, 2.5, 3, 5, 10].find((s) => s * p >= max) ?? 10) * p
}
