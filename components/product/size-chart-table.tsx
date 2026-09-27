import type { SizeChart } from "@/types";
import { cn } from "@/lib/utils";

interface SizeChartTableProps {
  chart: SizeChart;
  /** Size to highlight (the shopper's current selection). */
  highlight?: string | null;
  className?: string;
}

/** Accessible measurement table for one size chart. */
export function SizeChartTable({ chart, highlight, className }: SizeChartTableProps) {
  return (
    <div className={cn("overflow-x-auto rounded-xl border", className)}>
      <table className="w-full min-w-[22rem] text-sm tabular-nums">
        <caption className="sr-only">
          {chart.title} — measurements in {chart.unit === "in" ? "inches" : "centimetres"}
        </caption>
        <thead className="bg-secondary/70 text-left">
          <tr>
            <th scope="col" className="px-4 py-2.5 font-semibold">Size</th>
            {chart.columns.map((c) => (
              <th key={c} scope="col" className="px-4 py-2.5 font-semibold">
                {c} <span className="font-normal text-muted-foreground">({chart.unit})</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {chart.rows.map((row) => (
            <tr
              key={row.size}
              aria-current={highlight === row.size ? "true" : undefined}
              className={cn(highlight === row.size && "bg-brand-50 font-semibold text-primary")}
            >
              <th scope="row" className="px-4 py-2.5 text-left font-semibold">{row.size}</th>
              {row.values.map((v, i) => (
                <td key={`${row.size}-${i}`} className="px-4 py-2.5">{v}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
