import { z } from "zod";
import { withApi, ok } from "@/lib/api-handler";
import { listInventory } from "@/services/admin";

const querySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

export const dynamic = "force-dynamic";

/** Admin inventory levels per stock location. */
export const GET = withApi(
  { name: "admin-inventory", role: "admin", querySchema, limit: 60 },
  async ({ query }) => ok(await listInventory(query))
);
