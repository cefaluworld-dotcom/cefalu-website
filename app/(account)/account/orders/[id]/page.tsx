import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { PageProps } from "@/types";
import { auth } from "@/auth";
import { ROUTES } from "@/constants";
import { constructMetadata } from "@/lib/seo";
import { getOrder } from "@/services/orders";
import { formatDate, formatPrice } from "@/utils/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PrintInvoiceButton } from "@/components/account/print-invoice-button";

export const metadata: Metadata = constructMetadata({
  title: "Order Details", pathname: "/account/orders", noIndex: true,
});

export default async function OrderDetailPage({ params }: PageProps<{ id: string }>) {
  const { id } = await params;
  const session = await auth();
  const order = session?.medusaToken ? await getOrder(session.medusaToken, id) : null;
  if (!order) notFound();

  const addr = order.shipping_address;

  return (
    <div className="space-y-6 print:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Button asChild variant="ghost" size="sm">
          <Link href={ROUTES.accountOrders}><ArrowLeft aria-hidden="true" /> All orders</Link>
        </Button>
        <PrintInvoiceButton />
      </div>

      <header className="rounded-2xl border bg-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold">Invoice · Order #{order.display_id}</h1>
            <p className="text-sm text-muted-foreground">
              Placed {formatDate(order.created_at as string)} · {order.email}
            </p>
          </div>
          <Badge variant="secondary" className="capitalize">{order.status}</Badge>
        </div>
        {addr && (
          <p className="mt-4 text-sm text-muted-foreground">
            <strong className="text-foreground">Ship to:</strong> {addr.first_name} {addr.last_name},{" "}
            {addr.address_1}{addr.address_2 ? `, ${addr.address_2}` : ""}, {addr.city}, {addr.province}{" "}
            {addr.postal_code}
          </p>
        )}
      </header>

      <div className="rounded-2xl border bg-card">
        <ul className="divide-y px-6">
          {(order.items ?? []).map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-4 py-4 text-sm">
              <span className="min-w-0">
                <span className="line-clamp-1 font-semibold">{item.title}</span>
                <span className="text-xs text-muted-foreground">Qty {item.quantity}</span>
              </span>
              <span className="font-semibold">{formatPrice(item.total ?? 0)}</span>
            </li>
          ))}
        </ul>
        <Separator />
        <dl className="space-y-2 p-6 text-sm">
          <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatPrice(order.subtotal ?? 0)}</dd></div>
          <div className="flex justify-between"><dt className="text-muted-foreground">Shipping</dt><dd>{formatPrice(order.shipping_total ?? 0)}</dd></div>
          <div className="flex justify-between"><dt className="text-muted-foreground">Tax (incl.)</dt><dd>{formatPrice(order.tax_total ?? 0)}</dd></div>
          <div className="flex justify-between text-base font-bold"><dt>Total</dt><dd>{formatPrice(order.total ?? 0)}</dd></div>
        </dl>
      </div>

      <p className="text-xs text-muted-foreground print:mt-8">
        Cefalu Apparel Pvt. Ltd. · GSTIN 27AAACN0000A1Z5 · This is a computer-generated invoice.
      </p>
    </div>
  );
}
