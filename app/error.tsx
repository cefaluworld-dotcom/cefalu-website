"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { RotateCcw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <Container size="md" className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-destructive/10">
        <TriangleAlert className="size-8 text-destructive" aria-hidden="true" />
      </span>
      <h1 className="mt-6 text-display-sm">Something went wrong</h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        An unexpected error occurred while loading this page. It has been reported to our team.
        {error.digest && (
          <span className="mt-2 block font-mono text-xs">Reference: {error.digest}</span>
        )}
      </p>
      <Button size="lg" className="mt-8" onClick={reset}>
        <RotateCcw aria-hidden="true" />
        Try again
      </Button>
    </Container>
  );
}
