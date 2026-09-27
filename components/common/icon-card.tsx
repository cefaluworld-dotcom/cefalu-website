import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface IconCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  tone?: "brand" | "gold";
}

/** Generic feature/benefit card: icon chip, title, body. */
export function IconCard({ icon: Icon, title, description, className, tone = "brand" }: IconCardProps) {
  return (
    <article
      className={cn(
        "card-hover flex h-full flex-col gap-4 rounded-2xl border bg-card p-6",
        className
      )}
    >
      <span
        className={cn(
          "flex size-12 items-center justify-center rounded-xl",
          tone === "brand" ? "bg-secondary text-primary" : "bg-gold-100 text-gold-700"
        )}
      >
        <Icon className="size-6" aria-hidden="true" />
      </span>
      <div>
        <h3 className="font-display text-lg font-bold">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </article>
  );
}
