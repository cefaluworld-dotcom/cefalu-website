"use client";

import { STORAGE_KEYS } from "@/constants";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

interface Prefs {
  orderUpdates: boolean;
  restockAlerts: boolean;
  offers: boolean;
  journal: boolean;
}

const DEFAULTS: Prefs = { orderUpdates: true, restockAlerts: true, offers: false, journal: true };

const ROWS: Array<{ key: keyof Prefs; title: string; desc: string }> = [
  { key: "orderUpdates", title: "Order updates", desc: "Dispatch, delivery and refund status (email + SMS)." },
  { key: "restockAlerts", title: "Restock alerts", desc: "When a wishlisted product is back in stock." },
  { key: "offers", title: "Offers & promotions", desc: "Occasional discounts and subscriber-only deals." },
  { key: "journal", title: "New drops & journal", desc: "New collections, style notes and fit tips." },
];

export function NotificationPrefs() {
  const [prefs, setPrefs, hydrated] = useLocalStorage<Prefs>(STORAGE_KEYS.notifications, DEFAULTS);

  if (!hydrated) return <Skeleton className="h-64 rounded-2xl" />;

  return (
    <ul className="divide-y rounded-2xl border bg-card">
      {ROWS.map((row) => (
        <li key={row.key} className="flex items-center justify-between gap-4 p-5">
          <div>
            <Label htmlFor={`pref-${row.key}`} className="text-sm font-bold">{row.title}</Label>
            <p className="mt-0.5 text-xs text-muted-foreground">{row.desc}</p>
          </div>
          <Switch
            id={`pref-${row.key}`}
            checked={prefs[row.key]}
            onCheckedChange={(v) => setPrefs({ ...prefs, [row.key]: v })}
          />
        </li>
      ))}
    </ul>
  );
}
