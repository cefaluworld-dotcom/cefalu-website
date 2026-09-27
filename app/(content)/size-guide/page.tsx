import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import { SIZE_CHARTS } from "@/constants/catalog-content";
import { Section } from "@/components/layout/section";
import { FitFinder } from "@/components/home/fit-finder";
import { SizeChartTable } from "@/components/product/size-chart-table";

export const metadata: Metadata = constructMetadata({
  title: "Size Guide",
  description:
    "Cefalu size charts for men's shirts, t-shirts, trousers, kurtas and blazers, and women's kurtis, dresses and co-ord sets — with how-to-measure instructions.",
  pathname: "/size-guide",
});

export default function SizeGuidePage() {
  const charts = Object.values(SIZE_CHARTS);
  return (
    <>
      <Section
        eyebrow="Size guide"
        title="Find the size that fits"
        description="All charts are in inches. Enter one measurement below for a quick answer, or use the full charts."
        padding="lg"
      >
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.2fr]">
          <FitFinder />
          <nav aria-label="Size charts" className="rounded-2xl border bg-surface p-6">
            <p className="text-sm font-semibold">Jump to a chart</p>
            <ul className="mt-3 space-y-2">
              {charts.map((c) => (
                <li key={c.id}>
                  <a href={`#${c.id}`} className="link-underline text-sm text-primary">{c.title}</a>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-muted-foreground">
              Between two sizes? Pick the larger one — exchanges are free if it isn&apos;t right.
            </p>
          </nav>
        </div>
      </Section>

      {charts.map((chart) => (
        <Section key={chart.id} id={chart.id} className="scroll-mt-24 border-t" padding="sm" title={chart.title}>
          <SizeChartTable chart={chart} />
          {chart.fitNote && <p className="mt-3 text-sm text-muted-foreground">{chart.fitNote}</p>}
          <dl className="mt-6 grid gap-4 sm:grid-cols-3">
            {chart.howToMeasure.map((m) => (
              <div key={m.label} className="rounded-xl border p-4">
                <dt className="text-sm font-semibold">{m.label}</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{m.description}</dd>
              </div>
            ))}
          </dl>
        </Section>
      ))}
    </>
  );
}
