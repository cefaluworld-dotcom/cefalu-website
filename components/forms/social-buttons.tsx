"use client";

import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4.5" aria-hidden="true">
      <path fill="#EA4335" d="M12 5.04c1.62 0 3.06.56 4.2 1.64l3.12-3.12C17.46 1.8 14.96.75 12 .75 7.44.75 3.52 3.36 1.63 7.16l3.64 2.83C6.17 7.2 8.85 5.04 12 5.04Z" />
      <path fill="#4285F4" d="M23.25 12.27c0-.79-.07-1.55-.2-2.27H12v4.51h6.32a5.4 5.4 0 0 1-2.34 3.55l3.58 2.78c2.1-1.94 3.69-4.8 3.69-8.57Z" />
      <path fill="#FBBC05" d="M5.27 14.01a6.73 6.73 0 0 1 0-4.02L1.63 7.16a11.24 11.24 0 0 0 0 10.09l3.64-2.83Z" />
      <path fill="#34A853" d="M12 23.25c3.04 0 5.6-1 7.46-2.72l-3.58-2.78c-1 .68-2.29 1.09-3.88 1.09-3.15 0-5.83-2.16-6.73-5.06l-3.64 2.83c1.89 3.8 5.81 6.64 10.37 6.64Z" />
    </svg>
  );
}

/** Social sign-in — OAuth providers aren't configured on this deployment yet, so we say so honestly. */
export function SocialButtons() {
  function notConfigured(provider: string) {
    toast.info(`${provider} sign-in isn't enabled yet`, {
      description: "Use email & password for now — social login lands once OAuth keys are configured.",
    });
  }

  return (
    <div className="space-y-2.5">
      <Button type="button" variant="outline" className="w-full" onClick={() => notConfigured("Google")}>
        <GoogleIcon /> Continue with Google
      </Button>
      <Button type="button" variant="outline" className="w-full" onClick={() => notConfigured("Apple")}>
        <svg viewBox="0 0 24 24" className="size-4.5 fill-foreground" aria-hidden="true">
          <path d="M16.36 12.94c.03 3.05 2.68 4.07 2.71 4.08-.02.07-.42 1.45-1.4 2.87-.84 1.23-1.72 2.45-3.1 2.48-1.36.02-1.8-.8-3.35-.8-1.55 0-2.04.78-3.32.83-1.33.05-2.35-1.33-3.2-2.55C2.96 17.35 1.62 12.8 3.4 9.72a4.97 4.97 0 0 1 4.2-2.55c1.31-.02 2.55.88 3.35.88.8 0 2.3-1.09 3.89-.93.66.03 2.51.27 3.7 2.02-.1.06-2.21 1.29-2.18 3.8ZM13.8 4.24c.71-.86 1.19-2.05 1.06-3.24-1.02.04-2.26.68-3 1.54-.66.76-1.23 1.98-1.08 3.14 1.14.09 2.31-.58 3.02-1.44Z" />
        </svg>
        Continue with Apple
      </Button>
      <div className="flex items-center gap-3 py-1">
        <span className="h-px flex-1 bg-border" aria-hidden="true" />
        <span className="text-2xs font-semibold uppercase tracking-wide text-muted-foreground">or</span>
        <span className="h-px flex-1 bg-border" aria-hidden="true" />
      </div>
    </div>
  );
}
