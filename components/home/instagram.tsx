"use client";

import { motion } from "framer-motion";
import { Instagram } from "lucide-react";
import { siteConfig } from "@/config/site";
import { INSTAGRAM_TILES } from "@/constants/marketing";
import { cn } from "@/lib/utils";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";

/** Home §12 — Instagram feed placeholder grid. */
export function InstagramFeed() {
  return (
    <Section
      eyebrow="@cefalu.in"
      title="Worn by you"
      description="Styling ideas, new drops and fit tips. Tag @cefalu.in to be featured."
      className="border-t bg-surface"
    >
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {INSTAGRAM_TILES.map((tile, i) => (
          <motion.li
            key={tile.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.35, delay: i * 0.05, ease: "easeOut" }}
          >
            <a
              href={siteConfig.links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${tile.label} — opens Instagram in a new tab`}
              className={cn(
                "group relative flex aspect-square items-end overflow-hidden rounded-2xl border bg-gradient-to-br p-3",
                tile.tone
              )}
            >
              <Instagram
                className="absolute right-3 top-3 size-5 text-primary/70 transition-transform group-hover:scale-110"
                aria-hidden="true"
              />
              <span className="text-2xs font-semibold leading-snug text-brand-900/80">
                {tile.label}
              </span>
            </a>
          </motion.li>
        ))}
      </ul>
      <div className="mt-8 text-center">
        <Button asChild variant="outline">
          <a href={siteConfig.links.instagram} target="_blank" rel="noopener noreferrer">
            <Instagram aria-hidden="true" /> Follow @cefalu.in
          </a>
        </Button>
      </div>
    </Section>
  );
}
