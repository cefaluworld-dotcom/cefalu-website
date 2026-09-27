import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import { Section } from "@/components/layout/section";

export const metadata: Metadata = constructMetadata({
  title: "Fabric Care Guide",
  description: "How to wash, dry and iron cotton, linen, rayon and stretch fabrics so your Cefalu clothes last longer.",
  pathname: "/fabric-care",
});

const GUIDES = [
  {
    fabric: "Cotton",
    feel: "Breathable and soft; gets softer with every wash.",
    care: ["Machine wash cold with similar colours", "Turn prints inside out", "Line dry in shade to keep colours bright", "Warm iron, on the reverse for prints"],
  },
  {
    fabric: "Cotton stretch",
    feel: "Cotton with a little elastane for movement and shape retention.",
    care: ["Machine wash cold", "Avoid high-heat tumble drying — heat weakens the stretch", "Line dry", "Iron on low to medium"],
  },
  {
    fabric: "Linen & linen blends",
    feel: "Cool and airy with a natural texture; creasing is part of its character.",
    care: ["Gentle wash in cold water", "Don't wring — press water out", "Dry flat or on a hanger in shade", "Iron while slightly damp, or steam"],
  },
  {
    fabric: "Rayon",
    feel: "Fluid and soft with a beautiful drape; weaker when wet.",
    care: ["Hand wash in cold water", "Don't soak for long or wring", "Dry flat in shade", "Iron on low heat, on the reverse"],
  },
];

export default function FabricCarePage() {
  return (
    <Section
      eyebrow="Fabric care"
      title="Keep it looking new"
      description="Follow the care label first. These are the general rules we use for each fabric in our range."
      padding="lg"
    >
      <div className="grid gap-6 md:grid-cols-2">
        {GUIDES.map((g) => (
          <article key={g.fabric} className="rounded-2xl border bg-card p-6">
            <h2 className="text-2xl">{g.fabric}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{g.feel}</p>
            <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
              {g.care.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <p className="mt-8 text-sm text-muted-foreground">
        Wash dark and bright colours separately for the first few washes — natural dyes can release some colour at first.
      </p>
    </Section>
  );
}
