import { z } from "zod";
import { withApi, ok } from "@/lib/api-handler";
import { listAdminCustomers } from "@/services/admin";

const querySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
  q: z.string().max(100).optional(),
});

export const dynamic = "force-dynamic";

/** Moderator+ customer directory with search. */
export const GET = withApi(
  { name: "admin-customers", role: "moderator", querySchema, limit: 60 },
  async ({ query }) => ok(await listAdminCustomers(query))
);
