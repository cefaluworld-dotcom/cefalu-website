import { z } from "zod";
import { withApi, ok } from "@/lib/api-handler";
import { listAdminOrders } from "@/services/admin";

const querySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
  status: z.string().max(30).optional(),
});

export const dynamic = "force-dynamic";

/** Moderator+ order listing proxied from the Medusa Admin API. */
export const GET = withApi(
  { name: "admin-orders", role: "moderator", querySchema, limit: 60 },
  async ({ query }) => ok(await listAdminOrders(query))
);
