import type { Metadata } from "next";
import { Ruler, RefreshCcw, Shirt, Tag } from "lucide-react";
import { constructMetadata } from "@/lib/seo";
import { EXCHANGE_WINDOW_DAYS } from "@/constants";
import { Section } from "@/components/layout/section";
import { IconCard } from "@/components/common/icon-card";
import { HomeCta } from "@/components/home/cta";

export const metadata: Metadata = constructMetadata({
  title: "About Cefalu",
  description:
    "Cefalu makes everyday readymade clothing for men and women — honest fabrics, measured size charts and free exchanges.",
  pathname: "/about",
});

const commitments = [
  {
    icon: Ruler,
    title: "Measured, not guessed",
    description:
      "Every product has a size chart taken from the actual garment, in inches, with a plain note on how that style fits.",
  },
  {
    icon: Shirt,
    title: "Fabric you can read",
    description:
      "We state the full composition and weight — '100% cotton, 180 GSM', not just 'premium fabric' — so you know what you're buying.",
  },
  {
    icon: RefreshCcw,
    title: `${EXCHANGE_WINDOW_DAYS}-day free exchanges`,
    description: "If the size isn't right, we collect it and send the one that is. No fee, no argument.",
  },
  {
    icon: Tag,
    title: "Fair, final prices",
    description: "The price you see includes GST. Shipping is free above ₹999 and cash on delivery is available.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Section eyebrow="About us" title="Everyday clothing, cut to fit." containerSize="md" padding="lg">
        <div className="space-y-5 text-base leading-relaxed text-muted-foreground">
          <p>
            Cefalu makes readymade shirts, t-shirts, trousers, kurtas, kurtis, dresses and co-ord sets for men and women —
            the clothes you reach for every week.
          </p>
          <p>
            Most returns in online fashion come down to one thing: the size was wrong. So we built this store around
            getting fit right the first time — measured charts on every product, fit notes written for real bodies, and
            exchanges that cost you nothing when we miss.
          </p>
        </div>
      </Section>

      <Section className="border-t bg-surface" eyebrow="What we promise" title="Four things we don't compromise on">
        <div className="grid gap-6 sm:grid-cols-2">
          {commitments.map((c) => (
            <IconCard key={c.title} icon={c.icon} title={c.title} description={c.description} />
          ))}
        </div>
      </Section>

      <HomeCta />
    </>
  );
}
