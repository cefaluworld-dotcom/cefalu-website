import * as React from "react";
import { cn } from "@/lib/utils";

const colClasses = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  5: "grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
  6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
} as const;

const gapClasses = {
  sm: "gap-3 md:gap-4",
  default: "gap-4 md:gap-6",
  lg: "gap-6 md:gap-8",
} as const;

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: keyof typeof colClasses;
  gap?: keyof typeof gapClasses;
  as?: React.ElementType;
}

export function Grid({ cols = 3, gap = "default", as: Comp = "div", className, ...props }: GridProps) {
  return <Comp className={cn("grid", colClasses[cols], gapClasses[gap], className)} {...props} />;
}
