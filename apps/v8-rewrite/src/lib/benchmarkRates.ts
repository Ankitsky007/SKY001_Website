import type { StoryRow } from '@skyfall/core/v8'

export type Metric = 'iou' | 'time' | 'cost'
/** In the order of the table: IoU, time per sample, cost per sample. */
export const METRICS: Metric[] = ['iou', 'time', 'cost']

/** The table's own value for a metric: IoU %, seconds or dollars per sample. */
export function metricValue(row: StoryRow, metric: Metric) {
  if (metric === 'time') return row.seconds
  if (metric === 'cost') return row.cost
  return row.iou
}

/** Splits a table label ("$0.005", "1,250 s", "79.7%") into what goes before and after the number, and its decimals, so it can count up in the same format. */
export function labelParts(label: string) {
  const m = /^(\$?)([\d,]+)(?:\.(\d+))?(.*)$/.exec(label)
  if (!m) return null
  return { prefix: m[1], decimals: m[3]?.length ?? 0, commas: m[2].includes(','), suffix: m[4] }
}

export function formatLike(label: string, v: number) {
  const p = labelParts(label)
  if (!p) return label
  const n = p.commas ? v.toLocaleString('en-US', { minimumFractionDigits: p.decimals, maximumFractionDigits: p.decimals }) : v.toFixed(p.decimals)
  return `${p.prefix}${n}${p.suffix}`
}

// BIM keeps the flipped rates for now (Ankit, 2026-10-18): samples per hour and per $1.
export type RateMetric = 'speed' | 'cost' | 'iou'
export const RATE_METRICS: RateMetric[] = ['speed', 'cost', 'iou']

/** Samples per hour and samples per $1 make the longest bar the best one, like accuracy. */
export function rateValue(row: StoryRow, metric: RateMetric) {
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
