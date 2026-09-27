import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ROUTES } from "@/constants";
import { Container } from "@/components/layout/container";
import { AccountNavLink } from "@/components/account/account-nav-link";

const NAV = [
  { title: "Dashboard", href: ROUTES.account },
  { title: "Orders", href: ROUTES.accountOrders },
  { title: "Addresses", href: ROUTES.accountAddresses },
  { title: "Wishlist", href: ROUTES.accountWishlist },
  { title: "Notifications", href: ROUTES.accountNotifications },
  { title: "Profile", href: ROUTES.accountProfile },
  { title: "Security", href: ROUTES.accountSecurity },
] as const;

export default async function AccountLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect(`${ROUTES.login}?callbackUrl=${ROUTES.account}`);

  return (
    <Container size="xl" className="grid gap-8 py-10 md:py-14 lg:grid-cols-[15rem_1fr]">
      <aside aria-label="Account navigation">
        <nav className="rounded-2xl border bg-card p-2 lg:sticky lg:top-24">
          <ul className="flex gap-1 overflow-x-auto scrollbar-none lg:flex-col">
            {NAV.map((item) => (
              <li key={item.href} className="shrink-0 lg:shrink">
                <AccountNavLink href={item.href} title={item.title} iconName={item.title} />
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <div className="min-w-0">{children}</div>
    </Container>
  );
}
