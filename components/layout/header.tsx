"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { Heart, User } from "lucide-react";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/use-scroll";
import { Logo } from "@/components/common/logo";
import { ThemeSwitcher } from "@/components/common/theme-switcher";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { MainNav } from "@/components/layout/main-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { CartButton } from "@/components/cart/cart-button";
import { SearchOverlay } from "@/components/search/search-overlay";
import { useWishlistStore, selectWishlistCount } from "@/store/wishlist-store";
import { useMounted } from "@/hooks/use-mounted";

const CartDrawer = dynamic(
  () => import("@/components/cart/cart-drawer").then((m) => m.CartDrawer),
  { ssr: false }
);

export function Header() {
  const scrolled = useScroll(8);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b bg-background/85 backdrop-blur-md transition-shadow",
        scrolled && "shadow-sm"
      )}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground"
      >
        Skip to main content
      </a>

      <div className="mx-auto flex h-18 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 lg:hidden">
          <MobileNav />
        </div>

        <Logo className="lg:mr-6" />

        <MainNav />

        <div className="flex items-center gap-0.5 sm:gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <span><SearchOverlay /></span>
            </TooltipTrigger>
            <TooltipContent>Search</TooltipContent>
          </Tooltip>

          <div className="hidden sm:block">
            <ThemeSwitcher />
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="hidden sm:inline-flex"
                aria-label="Your account"
              >
                <Link href={ROUTES.account}>
                  <User className="size-5" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Account</TooltipContent>
          </Tooltip>

          <WishlistHeaderButton />
          <CartButton />
        </div>
      </div>

      <CartDrawer />
    </header>
  );
}


function WishlistHeaderButton() {
  const mounted = useMounted();
  const count = useWishlistStore(selectWishlistCount);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button asChild variant="ghost" size="icon" aria-label={`Wishlist (${mounted ? count : 0} items)`}>
          <Link href={ROUTES.wishlist} className="relative">
            <Heart className="size-5" />
            {mounted && count > 0 && (
              <span
                aria-hidden="true"
                className="absolute -right-0.5 -top-0.5 flex size-4.5 items-center justify-center rounded-full bg-primary text-2xs font-bold text-primary-foreground"
              >
                {count > 9 ? "9+" : count}
              </span>
            )}
          </Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent>Wishlist</TooltipContent>
    </Tooltip>
  );
}
