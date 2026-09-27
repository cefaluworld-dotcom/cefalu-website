"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

/** Accessible n-digit OTP input with auto-advance and paste support. */
export function OtpInput({ length = 6, value, onChange, className }: OtpInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  function setDigit(index: number, digit: string) {
    const chars = value.padEnd(length, " ").split("");
    chars[index] = digit || " ";
    onChange(chars.join("").trimEnd());
    if (digit && index < length - 1) refs.current[index + 1]?.focus();
  }

  function onKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !value[index] && index > 0) refs.current[index - 1]?.focus();
    if (e.key === "ArrowLeft" && index > 0) refs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < length - 1) refs.current[index + 1]?.focus();
  }

  function onPaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    onChange(pasted);
    refs.current[Math.min(pasted.length, length - 1)]?.focus();
  }

  return (
    <div className={cn("flex gap-2", className)} onPaste={onPaste} role="group" aria-label={`${length}-digit code`}>
      {Array.from({ length }, (_, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          inputMode="numeric"
          maxLength={1}
          value={value[i] ?? ""}
          onChange={(e) => setDigit(i, e.target.value.replace(/\D/g, ""))}
          onKeyDown={(e) => onKeyDown(i, e)}
          aria-label={`Digit ${i + 1}`}
          className="size-12 rounded-xl border bg-background text-center font-display text-lg font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      ))}
    </div>
  );
}
