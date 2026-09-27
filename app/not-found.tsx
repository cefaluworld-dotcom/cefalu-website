import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { ROUTES } from "@/constants";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";

export default function NotFound() {
  return (
    <Container size="md" className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-secondary">
        <Compass className="size-8 text-primary" aria-hidden="true" />
      </span>
      <p className="eyebrow mt-6">Error 404</p>
      <h1 className="mt-3 text-display-sm md:text-display-md">This page took a rest day</h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has moved. Head back to the shop to
        keep your streak going.
      </p>
      <div className="mt-8 flex flex-col gap-3 xs:flex-row">
        <Button asChild size="lg">
          <Link href={ROUTES.home}>
            <ArrowLeft aria-hidden="true" />
            Back to home
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href={ROUTES.shop}>Browse products</Link>
        </Button>
      </div>
    </Container>
  );
}
