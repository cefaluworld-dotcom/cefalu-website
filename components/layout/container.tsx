import * as React from "react";
import { cn } from "@/lib/utils";

const sizes = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-7xl",
  xl: "max-w-[1440px]",
  prose: "max-w-[72ch]",
} as const;

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: keyof typeof sizes;
  as?: React.ElementType;
}

export function Container({ className, size = "lg", as: Comp = "div", ...props }: ContainerProps) {
  return (
    <Comp className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", sizes[size], className)} {...props} />
  );
}
