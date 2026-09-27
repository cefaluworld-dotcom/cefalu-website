import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Heart, LogOut, MapPin, Package } from "lucide-react";
import { auth, signOut } from "@/auth";
import { ROUTES } from "@/constants";
import { constructMetadata } from "@/lib/seo";
import { listOrders } from "@/services/orders";
import { getInitials, formatPrice, formatDate } from "@/utils/format";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = constructMetadata({
  title: "Your Account",
  pathname: "/account",
  noIndex: true,
});

export default async function AccountPage() {
  const session = await auth();
  const orders = session?.medusaToken ? await listOrders(session.medusaToken) : [];
  const recent = orders.slice(0, 3);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="size-14">
            <AvatarFallback className="bg-secondary text-lg text-primary">
              {getInitials(session?.user?.name ?? "N W")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-display text-2xl font-bold">Namaste, {session?.user?.name ?? "there"}</h1>
            <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
          </div>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <Button variant="outline" size="sm" type="submit">
            <LogOut aria-hidden="true" /> Sign out
          </Button>
        </form>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { title: "Orders", desc: "Track & reorder", href: ROUTES.accountOrders, Icon: Package },
          { title: "Addresses", desc: "Manage delivery spots", href: ROUTES.accountAddresses, Icon: MapPin },
          { title: "Wishlist", desc: "Saved for later", href: ROUTES.accountWishlist, Icon: Heart },
        ].map(({ title, desc, href, Icon }) => (
          <Link key={href} href={href} className="card-hover group rounded-2xl border bg-card p-5">
            <Icon className="size-6 text-primary" aria-hidden="true" />
            <p className="mt-3 flex items-center gap-1 font-display text-base font-bold">
              {title}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </p>
            <p className="text-xs text-muted-foreground">{desc}</p>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent orders</CardTitle>
          <CardDescription>
            {recent.length > 0
              ? "Your latest purchases at a glance."
              : "No orders yet — they'll appear here after your first checkout."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <Button asChild size="sm"><Link href={ROUTES.shop}>Start shopping</Link></Button>
          ) : (
            <ul className="divide-y">
              {recent.map((o) => (
                <li key={o.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div>
                    <p className="text-sm font-bold">#{o.display_id}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(o.created_at as string)}</p>
                  </div>
                  <Badge variant="secondary" className="capitalize">{o.status}</Badge>
                  <p className="text-sm font-semibold">{formatPrice(o.total ?? 0)}</p>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={ROUTES.accountOrder(o.id)}>View</Link>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
