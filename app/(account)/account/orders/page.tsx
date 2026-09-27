import type { Metadata } from "next";
import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { auth } from "@/auth";
import { ROUTES } from "@/constants";
import { constructMetadata } from "@/lib/seo";
import { listOrders } from "@/services/orders";
import { formatDate, formatPrice } from "@/utils/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = constructMetadata({
  title: "Your Orders", pathname: "/account/orders", noIndex: true,
});

export default async function OrdersPage() {
  const session = await auth();
  const orders = session?.medusaToken ? await listOrders(session.medusaToken) : [];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Orders</h1>
      {orders.length === 0 ? (
        <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-dashed py-16 text-center">
          <PackageSearch className="size-9 text-muted-foreground" aria-hidden="true" />
          <p className="font-display font-semibold">No orders yet</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Orders placed through the Medusa-backed checkout appear here automatically.
          </p>
          <Button asChild size="sm" className="mt-2"><Link href={ROUTES.shop}>Start shopping</Link></Button>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {orders.map((o) => (
            <li key={o.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card p-4">
              <div>
                <p className="text-sm font-bold">Order #{o.display_id}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(o.created_at as string)} · {(o.items ?? []).length} item{(o.items ?? []).length === 1 ? "" : "s"}
                </p>
              </div>
              <Badge variant="secondary" className="capitalize">{o.status}</Badge>
              <p className="text-sm font-semibold">{formatPrice(o.total ?? 0)}</p>
              <Button asChild variant="outline" size="sm">
                <Link href={ROUTES.accountOrder(o.id)}>Details</Link>
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
