import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ROUTES } from "@/constants";
import { SHOP_CATEGORIES } from "@/constants/marketing";
import { Section } from "@/components/layout/section";

const DEPARTMENTS = ["Men", "Women"] as const;

/** Home — shop by category as a department index (type-led, no stock imagery). */
export function FeaturedCategories() {
  return (
    <Section eyebrow="Shop by category" title="Find your aisle">
      <div className="grid gap-6 md:grid-cols-2">
        {DEPARTMENTS.map((dept) => (
          <div key={dept} className="rounded-2xl border bg-card">
            <div className="flex items-baseline justify-between border-b px-6 py-4">
              <h3 className="text-2xl">{dept}</h3>
              <Link
                href={`${ROUTES.shop}?gender=${dept.toLowerCase()}`}
                className="link-underline text-sm font-medium text-primary"
              >
                Shop all {dept.toLowerCase()}
              </Link>
            </div>
            <ul className="divide-y">
              {SHOP_CATEGORIES.filter((c) => c.department === dept).map((c) => (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    className="group flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-secondary/60 focus-visible:bg-secondary/60 focus-visible:outline-none"
                  >
                    <span>
                      <span className="block font-display text-xl">{c.title}</span>
                      <span className="block text-sm text-muted-foreground">{c.description}</span>
                    </span>
                    <ArrowRight
                      className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
