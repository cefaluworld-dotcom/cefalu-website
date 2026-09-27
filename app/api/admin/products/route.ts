import { z } from "zod";
import { withApi, ok } from "@/lib/api-handler";
import { listAdminProducts } from "@/services/admin";

const querySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
  q: z.string().max(100).optional(),
});

export const dynamic = "force-dynamic";

/** Moderator+ product catalog view (variants + status). */
export const GET = withApi(
  { name: "admin-products", role: "moderator", querySchema, limit: 60 },
  async ({ query }) => ok(await listAdminProducts(query))
);
