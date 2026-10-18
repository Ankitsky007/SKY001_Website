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

