import { Banknote, RefreshCcw, ShieldCheck, Truck, type LucideIcon } from "lucide-react";
import { STORE_PROMISES } from "@/constants/marketing";
import { Container } from "@/components/layout/container";

const ICONS: Record<string, LucideIcon> = { Truck, RefreshCcw, Banknote, ShieldCheck };

/** Store promises — delivery, exchanges, COD, payments. */
export function TrustBar() {
  return (
    <section aria-label="Store promises" className="border-b bg-surface">
      <Container size="xl">
        <ul className="grid grid-cols-2 divide-border md:grid-cols-4 md:divide-x">
          {STORE_PROMISES.map((p) => {
            const Icon = ICONS[p.icon] ?? Truck;
            return (
              <li key={p.title} className="flex items-start gap-3 px-2 py-5 md:px-6">
                <Icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                <span>
                  <span className="block text-sm font-semibold">{p.title}</span>
                  <span className="block text-xs leading-relaxed text-muted-foreground">{p.description}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
