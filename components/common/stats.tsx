"use client";

import { motion } from "framer-motion";
import type { Stat } from "@/types";
import { cn } from "@/lib/utils";

interface StatsProps {
  stats: Stat[];
  className?: string;
}

/** Animated statistic cards with staggered scroll reveal. */
export function Stats({ stats, className }: StatsProps) {
  return (
    <dl className={cn("grid grid-cols-2 gap-4 lg:grid-cols-4", className)}>
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45, delay: i * 0.08, ease: "easeOut" }}
          className="rounded-2xl border bg-card p-6 text-center"
        >
          <dd className="font-display text-3xl font-bold text-primary md:text-4xl">
            {stat.value}
          </dd>
          <dt className="mt-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {stat.label}
          </dt>
        </motion.div>
      ))}
    </dl>
  );
}
