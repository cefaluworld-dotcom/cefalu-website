"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { mainNav } from "@/config/nav";
import { ROUTES } from "@/constants";
import { useUiStore } from "@/store/ui-store";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { LogoMark } from "@/components/common/logo";

export function MobileNav() {
  const { isMobileNavOpen, setMobileNavOpen } = useUiStore();

  const close = () => setMobileNavOpen(false);

  return (
    <Sheet open={isMobileNavOpen} onOpenChange={setMobileNavOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex w-full flex-col gap-0 overflow-y-auto p-0 sm:max-w-sm">
        <SheetHeader className="border-b p-4">
          <SheetTitle className="flex items-center gap-2.5">
            <LogoMark className="size-7" />
            <span className="font-display text-lg">Cefalu</span>
          </SheetTitle>
        </SheetHeader>

        <nav aria-label="Mobile" className="flex-1 p-4">
          <Accordion type="multiple" className="w-full">
            {mainNav.map((item) =>
              item.items?.length ? (
                <AccordionItem key={item.title} value={item.title}>
                  <AccordionTrigger className="text-base">{item.title}</AccordionTrigger>
                  <AccordionContent>
                    <ul className="flex flex-col gap-1">
                      {item.items.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={close}
                            className="block rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary/70 hover:text-primary"
                          >
                            {child.title}
                          </Link>
                        </li>
                      ))}
                      <li>
                        <Link
                          href={item.href}
                          onClick={close}
                          className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-primary"
                        >
                          Browse all products →
                        </Link>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ) : (
                <div key={item.title} className="border-b">
                  <Link
                    href={item.href}
                    onClick={close}
                    className="flex py-4 text-base font-semibold transition-colors hover:text-primary"
                  >
                    {item.title}
                  </Link>
                </div>
              )
            )}
          </Accordion>
        </nav>

        <div className="mt-auto space-y-3 border-t p-4">
          <Button asChild className="w-full" size="lg">
            <Link href={ROUTES.shop} onClick={close}>
              Shop all clothing
            </Link>
          </Button>
          <Separator />
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <Link href={ROUTES.login} onClick={close} className="link-underline font-medium">
              Sign in
            </Link>
            <Link href={ROUTES.account} onClick={close} className="link-underline font-medium">
              Track order
            </Link>
            <Link href={ROUTES.wishlist} onClick={close} className="link-underline font-medium">
              Wishlist
            </Link>
            <Link href={ROUTES.sizeGuide} onClick={close} className="link-underline font-medium">
              Size guide
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
