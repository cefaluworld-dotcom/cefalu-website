import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

/** Cefalu mark: an open "C" over a horizon line — the town's crescent bay. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-8", className)}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="7" className="fill-brand-600" />
      <path
        d="M21.5 10.2A8 8 0 1 0 21.5 21.8"
        className="stroke-white"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path d="M8 26h16" className="stroke-brand-200" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ className, withText = true }: { className?: string; withText?: boolean }) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2.5 focus-visible:outline-none", className)}
      aria-label={`${siteConfig.name} — home`}
    >
      <LogoMark />
      {withText && (
        <span className="font-display text-2xl uppercase leading-none tracking-[0.18em] text-foreground">
          Cefalu
        </span>
      )}
    </Link>
  );
}
