import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Sanitizes a post-auth redirect target to prevent open-redirect attacks.
 * Only same-origin, single-leading-slash relative paths are allowed; anything
 * else (absolute URLs, protocol-relative `//host`, backslashes) falls back.
 */
export function safeInternalPath(input: string | null | undefined, fallback = "/"): string {
  if (!input) return fallback;
  // Reject absolute URLs, protocol-relative, and backslash tricks.
  if (!input.startsWith("/") || input.startsWith("//") || input.includes("\\")) return fallback;
  // Reject control chars / whitespace-obfuscated schemes.
  if (/[\u0000-\u001F\u007F]/.test(input) || /^\/\s*\/\//.test(input)) return fallback;
  return input;
}
