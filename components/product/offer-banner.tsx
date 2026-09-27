import { RefreshCcw, Ticket, Truck } from "lucide-react";
import { EXCHANGE_WINDOW_DAYS, FREE_SHIPPING_THRESHOLD } from "@/constants";
import { formatPrice } from "@/utils/format";

export function OfferBanner() {
  const offers = [
    { icon: Ticket, text: "WELCOME10 — 10% off your first order" },
    { icon: Truck, text: `Free shipping above ${formatPrice(FREE_SHIPPING_THRESHOLD)}` },
    { icon: RefreshCcw, text: `Free exchanges within ${EXCHANGE_WINDOW_DAYS} days of delivery` },
  ] as const;

  return (
    <ul className="divide-y rounded-2xl border bg-brand-50/70">
      {offers.map(({ icon: Icon, text }) => (
        <li key={text} className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium">
          <Icon className="size-4 shrink-0 text-gold-600" aria-hidden="true" />
          {text}
        </li>
      ))}
    </ul>
  );
}
