import * as React from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/container";

const paddings = {
  none: "",
  sm: "py-10 md:py-14",
  default: "py-14 md:py-20 lg:py-24",
  lg: "py-20 md:py-28 lg:py-32",
} as const;

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  padding?: keyof typeof paddings;
  containerSize?: React.ComponentProps<typeof Container>["size"];
  eyebrow?: string;
  title?: string;
  description?: string;
  align?: "left" | "center";
  contained?: boolean;
}

export function Section({
  as: Comp = "section",
  padding = "default",
  containerSize = "lg",
  eyebrow,
  title,
  description,
  align = "left",
  contained = true,
  className,
  children,
  ...props
}: SectionProps) {
  const heading = (title || eyebrow || description) && (
    <div
      className={cn(
        "mb-10 max-w-2xl md:mb-14",
        align === "center" && "mx-auto text-center"
      )}
    >
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      {title && <h2 className="text-display-sm md:text-display-md">{title}</h2>}
      {description && <p className="mt-4 text-base text-muted-foreground md:text-lg">{description}</p>}
    </div>
  );

  return (
    <Comp className={cn(paddings[padding], className)} {...props}>
      {contained ? (
        <Container size={containerSize}>
          {heading}
          {children}
        </Container>
      ) : (
        <>
          {heading}
          {children}
        </>
      )}
    </Comp>
  );
}
