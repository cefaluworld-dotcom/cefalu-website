import type { ColorOption } from "@/types";
import { cn } from "@/lib/utils";

/** Compact, non-interactive swatch row for cards (interactive selection lives in the buy box). */
export function ColorSwatches({ colors, max = 5, className }: { colors: ColorOption[]; max?: number; className?: string }) {
  if (colors.length === 0) return null;
  const shown = colors.slice(0, max);
  const extra = colors.length - shown.length;
  return (
    <span className={cn("flex items-center gap-1.5", className)}>
      <span className="sr-only">Available in {colors.map((c) => c.name).join(", ")}</span>
      {shown.map((c) => (
        <span
          key={c.name}
          title={c.name}
          aria-hidden="true"
          className="size-3.5 rounded-full border border-black/15"
          style={{ backgroundColor: c.hex }}
        />
      ))}
      {extra > 0 && <span aria-hidden="true" className="text-2xs text-muted-foreground">+{extra}</span>}
    </span>
  );
}
