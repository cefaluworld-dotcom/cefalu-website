"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants";
import { OtpInput } from "@/components/forms/otp-input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

export function VerifyOtpForm({ className }: { className?: string }) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [cooldown, setCooldown] = useState(30);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = window.setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => window.clearTimeout(t);
  }, [cooldown]);

  function onVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\d{6}$/.test(code)) {
      toast.error("Enter all 6 digits");
      return;
    }
    toast.success("Number verified", { description: "Welcome to Cefalu." });
    router.push(ROUTES.account);
  }

  return (
    <form onSubmit={onVerify} className={cn("flex flex-col items-center gap-6", className)}>
      <OtpInput value={code} onChange={setCode} />
      <Button type="submit" size="lg" className="w-full">Verify</Button>
      <button
        type="button"
        disabled={cooldown > 0}
        onClick={() => {
          setCooldown(30);
          toast.info("Code re-sent", { description: "Give it up to a minute to arrive." });
        }}
        className="text-sm font-semibold text-primary disabled:text-muted-foreground"
      >
        {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
      </button>
    </form>
  );
}
