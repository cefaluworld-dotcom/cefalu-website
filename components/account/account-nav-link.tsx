"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell, Heart, LayoutDashboard, Lock, MapPin, Package, RefreshCcw, User, type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  Dashboard: LayoutDashboard, Orders: Package, Addresses: MapPin, Wishlist: Heart,
  Subscriptions: RefreshCcw, Notifications: Bell, Profile: User, Security: Lock,
};

export function AccountNavLink({ href, title, iconName }: { href: string; title: string; iconName: string }) {
  const pathname = usePathname();
  const active = href === "/account" ? pathname === href : pathname.startsWith(href);
  const Icon = ICONS[iconName] ?? User;

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-2.5 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
        active ? "bg-secondary font-semibold text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon className="size-4" aria-hidden="true" />
      {title}
    </Link>
  );
}
