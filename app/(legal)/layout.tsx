import type { ReactNode } from "react";
import { Container } from "@/components/layout/container";

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <Container size="prose" className="py-12 md:py-16">
      <article className="prose prose-neutral max-w-none dark:prose-invert prose-headings:font-display prose-a:text-primary">
        {children}
      </article>
    </Container>
  );
}
