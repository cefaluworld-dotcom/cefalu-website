import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ROUTES } from "@/constants";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";

export function HomeCta() {
  return (
    <section className="py-14 md:py-20">
      <Container size="lg">
        <div className="relative overflow-hidden rounded-3xl bg-brand-800 px-6 py-14 text-center text-white shadow-xl md:px-12 md:py-20">
          <p className="eyebrow justify-center !text-brand-200">First order</p>
          <h2 className="mx-auto mt-3 max-w-2xl text-display-sm md:text-display-md">
            Take 10% off your first order
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-white/80 md:text-base">
            Use code WELCOME10 at checkout · Free shipping over ₹999 · 7-day returns & exchanges
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 xs:flex-row">
            <Button asChild size="xl" variant="accent">
              <Link href={ROUTES.shop}>
                Start shopping
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              size="xl"
              variant="outline"
              className="border-white/40 text-white hover:border-white hover:bg-white/10 hover:text-white"
            >
              <Link href={ROUTES.about}>Our story</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
