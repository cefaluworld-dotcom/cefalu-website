import { withApi, ok } from "@/lib/api-handler";
import { getDashboardStats } from "@/services/admin";

export const dynamic = "force-dynamic";

/** Admin dashboard: totals, recent orders, daily sales series. */
export const GET = withApi({ name: "admin-dashboard", role: "admin", limit: 60 }, async () => {
  const stats = await getDashboardStats();
  return ok({ ...stats });
});
