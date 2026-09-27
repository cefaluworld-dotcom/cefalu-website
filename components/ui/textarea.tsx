import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[120px] w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground shadow-xs transition-colors",
          "placeholder:text-muted-foreground",
          "focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "aria-[invalid=true]:border-destructive aria-[invalid=true]:focus-visible:ring-destructive/30",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
