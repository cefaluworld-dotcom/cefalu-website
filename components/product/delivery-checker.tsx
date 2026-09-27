"use client";

import { useState } from "react";
import { MapPin, Truck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const METRO_PREFIXES = ["1", "2", "4", "5", "6", "7"];

/** Pincode serviceability check — static rules until a courier API is wired. */
export function DeliveryChecker() {
  const [pin, setPin] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function check() {
    setResult(null);
    setError(null);
    if (!/^[1-9]\d{5}$/.test(pin)) {
      setError("Enter a valid 6-digit PIN code.");
      return;
    }
    const metro = METRO_PREFIXES.includes(pin[0] ?? "");
    setResult(
      metro
        ? `Deliverable to ${pin} — arrives in 2–4 business days. Express available.`
        : `Deliverable to ${pin} — arrives in 4–7 business days.`
    );
  }

  return (
    <div className="rounded-2xl border p-4">
      <p className="flex items-center gap-2 text-sm font-bold">
        <MapPin className="size-4 text-primary" aria-hidden="true" /> Check delivery
      </p>
      <form
        className="mt-3 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          check();
        }}
      >
        <Input
          inputMode="numeric"
          maxLength={6}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
          placeholder="Enter PIN code"
          aria-label="Delivery PIN code"
        />
        <Button type="submit" variant="outline" size="sm" className="h-11">Check</Button>
      </form>
      <p aria-live="polite" className="mt-2 min-h-5 text-xs">
        {error && <span className="text-destructive">{error}</span>}
        {result && (
          <span className="flex items-start gap-1.5 text-success">
            <Truck className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" /> {result}
          </span>
        )}
      </p>
    </div>
  );
}
