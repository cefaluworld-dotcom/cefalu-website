import "server-only";
import { UpstreamError } from "@/lib/errors";

const BACKEND = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;
const ADMIN_KEY = process.env.MEDUSA_ADMIN_API_KEY; // secret API key (sk_…)

export const isAdminApiConfigured = Boolean(BACKEND && ADMIN_KEY);

/** Typed fetch against the Medusa Admin API using a secret API key. */
export async function medusaAdmin<T>(
  path: string,
  init?: { method?: string; body?: unknown; searchParams?: Record<string, string | number> }
): Promise<T> {
  if (!BACKEND || !ADMIN_KEY) throw new UpstreamError("Commerce admin API");

  const url = new URL(`/admin${path}`, BACKEND);
  for (const [k, v] of Object.entries(init?.searchParams ?? {})) url.searchParams.set(k, String(v));

  const res = await fetch(url, {
    method: init?.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`${ADMIN_KEY}:`).toString("base64")}`,
    },
    body: init?.body ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
  });

  if (!res.ok) {
    throw new UpstreamError(`Commerce admin API (${res.status})`);
  }
  return (await res.json()) as T;
}
