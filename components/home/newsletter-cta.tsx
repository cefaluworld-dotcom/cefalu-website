import { Mail } from "lucide-react";
import { Container } from "@/components/layout/container";
import { NewsletterForm } from "@/components/forms/newsletter-form";

/** Home §13 — standalone newsletter signup band. */
export function NewsletterCta() {
  return (
    <section aria-labelledby="newsletter-heading" className="border-t bg-brand-900 text-white">
      <Container size="md" className="py-14 text-center md:py-20">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-white/10">
          <Mail className="size-6 text-gold-400" aria-hidden="true" />
        </span>
        <h2 id="newsletter-heading" className="mt-5 font-display text-2xl font-bold md:text-3xl">
          New drops, before anyone else
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-white/70 md:text-base">
          One short email when a new collection lands — plus early access to the sale. No spam, unsubscribe anytime.</p>
        <div className="mx-auto mt-7 max-w-md">
          <NewsletterForm variant="dark" />
        </div>
      </Container>
    </section>
  );
}
