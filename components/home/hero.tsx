import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ROUTES } from "@/constants";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { FitFinder } from "@/components/home/fit-finder";

/** Home hero: the promise (fit) stated plainly, and proven by the fit finder beside it. */
export function Hero() {
  return (
    <section className="relative border-b">
      <Container size="xl" className="grid items-center gap-12 py-14 md:py-20 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:py-24">
        <div className="max-w-2xl">
          <p className="eyebrow mb-5">Shirts · Kurtas · Kurtis · Dresses · Co-ords</p>
          <h1 className="text-display-md md:text-display-lg lg:text-display-xl">
            Clothes that fit <span className="text-primary">the first time.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Honest fabrics, measured size charts on every product, and free 15-day exchanges — so the size
            you order is the size you keep.
          </p>
          <div className="mt-8 flex flex-col gap-3 xs:flex-row">
            <Button asChild size="xl">
              <Link href={`${ROUTES.shop}?gender=men`}>
                Shop men
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline">
              <Link href={`${ROUTES.shop}?gender=women`}>
                Shop women
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
        <FitFinder />
      </Container>
      {/* Signature: majolica tile band */}
      <div className="bg-majolica h-7 border-t" aria-hidden="true" />
    </section>
  );
}
