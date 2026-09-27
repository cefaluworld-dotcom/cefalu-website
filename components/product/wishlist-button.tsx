"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Heart } from "lucide-react";
import type { WishlistItem } from "@/types";
import { useWishlistStore } from "@/store/wishlist-store";
import { useMounted } from "@/hooks/use-mounted";
import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  item: Omit<WishlistItem, "addedAt">;
  className?: string;
  size?: "sm" | "md";
}

export function WishlistButton({ item, className, size = "md" }: WishlistButtonProps) {
  const mounted = useMounted();
  const reduce = useReducedMotion();
  const inList = useWishlistStore((s) => s.items.some((i) => i.handle === item.handle));
  const toggle = useWishlistStore((s) => s.toggle);
  const active = mounted && inList;

  return (
    <motion.button
      type="button"
      whileTap={reduce ? undefined : { scale: 0.85 }}
      onClick={() => {
        const added = toggle(item);
        toast.success(added ? "Saved to wishlist" : "Removed from wishlist", { description: item.title });
      }}
      aria-pressed={active}
      aria-label={active ? `Remove ${item.title} from wishlist` : `Add ${item.title} to wishlist`}
      className={cn(
        "flex items-center justify-center rounded-full border bg-background/90 backdrop-blur transition-colors",
        size === "sm" ? "size-8" : "size-10",
        active ? "border-destructive/40 text-destructive" : "text-muted-foreground hover:text-destructive",
        className
      )}
    >
      <motion.span
        key={String(active)}
        initial={reduce ? false : { scale: 0.6 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 18 }}
      >
        <Heart className={cn(size === "sm" ? "size-4" : "size-4.5", active && "fill-current")} aria-hidden="true" />
      </motion.span>
    </motion.button>
  );
}
