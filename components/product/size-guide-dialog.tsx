"use client";

import Link from "next/link";
import { Ruler } from "lucide-react";
import { SIZE_CHARTS } from "@/constants/catalog-content";
import { ROUTES } from "@/constants";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SizeChartTable } from "@/components/product/size-chart-table";

interface SizeGuideDialogProps {
  chartId: string;
  selectedSize?: string | null;
  fitAdvice?: string;
  modelInfo?: string;
}

/** Size chart for the current product, opened from beside the size selector. */
export function SizeGuideDialog({ chartId, selectedSize, fitAdvice, modelInfo }: SizeGuideDialogProps) {
  const chart = SIZE_CHARTS[chartId];
  if (!chart) return null;

  return (
    <Dialog>
      <DialogTrigger className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <Ruler className="size-4" aria-hidden="true" />
        Size guide
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-normal">{chart.title}</DialogTitle>
          <DialogDescription>
            {fitAdvice}
            {modelInfo ? ` ${modelInfo}.` : ""}
          </DialogDescription>
        </DialogHeader>
        <SizeChartTable chart={chart} highlight={selectedSize} />
        {chart.fitNote && <p className="text-sm text-muted-foreground">{chart.fitNote}</p>}
        <div>
          <h3 className="text-base">How to measure</h3>
          <dl className="mt-2 space-y-2 text-sm">
            {chart.howToMeasure.map((m) => (
              <div key={m.label}>
                <dt className="font-semibold">{m.label}</dt>
                <dd className="text-muted-foreground">{m.description}</dd>
              </div>
            ))}
          </dl>
        </div>
        <Link href={ROUTES.sizeGuide} className="link-underline text-sm font-medium text-primary">
          See all size charts
        </Link>
      </DialogContent>
    </Dialog>
  );
}
