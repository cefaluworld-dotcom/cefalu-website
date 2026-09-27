import { z } from "zod";
import { withApi, ok } from "@/lib/api-handler";
import { getDashboardStats } from "@/services/admin";

const querySchema = z.object({
  days: z.coerce.number().int().min(1).max(90).default(30),
});

export const dynamic = "force-dynamic";

/** Sales report: daily orders/revenue for the last N days + AOV. */
export const GET = withApi(
  { name: "admin-sales-report", role: "admin", querySchema, limit: 30 },
  async ({ query }) => {
    const stats = await getDashboardStats();
    const cutoff = new Date(Date.now() - query.days * 86_400_000).toISOString().slice(0, 10);
    const series = stats.salesByDay.filter((d) => d.date >= cutoff);
    const orders = series.reduce((s, d) => s + d.orders, 0);
    const revenue = series.reduce((s, d) => s + d.revenue, 0);
    return ok({
      configured: stats.configured,
      windowDays: query.days,
      orders,
      revenue,
      averageOrderValue: orders ? Math.round(revenue / orders) : 0,
      series,
    });
  }
);
