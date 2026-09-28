import { z } from "zod";
import { withApi, ok } from "@/lib/api-handler";
import { AppError, UpstreamError } from "@/lib/errors";
import { audit } from "@/lib/logger";

const bodySchema = z.object({
  confirm: z.literal("DELETE", {
    error: 'Type "DELETE" to confirm account deletion',
  }),
});

export const dynamic = "force-dynamic";

/**
 * Account deletion (GDPR/DPDP-style). Removes the Medusa customer via the
 * store API using the caller's own token; the Auth.js session is ended
 * client-side right after.
 */
export const POST = withApi(
  { name: "account-delete", bodySchema, role: "customer", limit: 3 },
  async ({ actor }) => {
    const backend = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;
    const pubKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

    if (!backend || !actor?.medusaToken) {
      // Nothing server-side to erase (offline/demo session) — treat as done.
      audit("account.delete", { email: actor?.email, medusa: false });
      return ok({ deleted: true, medusa: false });
    }

    const res = await fetch(`${backend.replace(/\/$/, "")}/store/customers/me`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${actor.medusaToken}`,
        ...(pubKey ? { "x-publishable-api-key": pubKey } : {}),
      },
      cache: "no-store",
    });

    if (res.status === 404 || res.status === 405) {
      throw new AppError(
        "UPSTREAM_ERROR",
        "Self-serve deletion isn't enabled on this commerce backend yet. Email care@cefalu.in and we'll erase your data within 72 hours.",
        501,
        { expose: true }
      );
    }
    if (!res.ok) throw new UpstreamError(`Account service (${res.status})`);

    audit("account.delete", { email: actor.email, medusa: true });
    return ok({ deleted: true, medusa: true });
  }
);
