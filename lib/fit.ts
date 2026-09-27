import type { SizeChart } from "@/types";

export interface SizeRecommendation {
  size: string;
  /** Measurement in the chart for the recommended size. */
  chartValue: number;
  /** True when the body measurement is larger than every size in the chart. */
  outOfRange: boolean;
}

/**
 * Recommends the smallest size whose chart measurement (column `columnIndex`)
 * is at least the body measurement plus `ease` — the room a garment needs over
 * the body to fit as designed (≈2 in for a regular-fit shirt charted as garment
 * measurements; 0 for charts given as body measurements).
 */
export function recommendSize(
  chart: SizeChart,
  bodyMeasurement: number,
  { columnIndex = 0, ease = 0 }: { columnIndex?: number; ease?: number } = {}
): SizeRecommendation | null {
  if (!Number.isFinite(bodyMeasurement) || bodyMeasurement <= 0 || chart.rows.length === 0) return null;
  const target = bodyMeasurement + ease;
  const parsed = chart.rows
    .map((r) => ({ size: r.size, value: Number.parseFloat(r.values[columnIndex] ?? "") }))
    .filter((r) => Number.isFinite(r.value));
  if (parsed.length === 0) return null;
  const fit = parsed.find((r) => r.value >= target);
  if (fit) return { size: fit.size, chartValue: fit.value, outOfRange: false };
  const largest = parsed[parsed.length - 1];
  return largest ? { size: largest.size, chartValue: largest.value, outOfRange: true } : null;
}
