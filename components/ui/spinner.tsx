import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const spinnerVariants = cva("animate-spin text-primary", {
  variants: {
    size: {
      sm: "size-4",
      default: "size-6",
      lg: "size-8",
      xl: "size-12",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface SpinnerProps extends React.SVGAttributes<SVGSVGElement>, VariantProps<typeof spinnerVariants> {
  label?: string;
}

function Spinner({ className, size, label = "Loading", ...props }: SpinnerProps) {
  return (
    <span role="status" className="inline-flex items-center justify-center">
      <svg
        className={cn(spinnerVariants({ size }), className)}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        {...props}
      >
        <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path
          className="opacity-90"
          fill="currentColor"
          d="M12 2a10 10 0 0 1 10 10h-4a6 6 0 0 0-6-6V2z"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );
}

export { Spinner };
