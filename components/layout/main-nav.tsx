"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNav } from "@/config/nav";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export function MainNav() {
  const pathname = usePathname();

  return (
    <NavigationMenu aria-label="Primary" className="hidden lg:flex">
      <NavigationMenuList>
        {mainNav.map((item) =>
          item.items?.length ? (
            <NavigationMenuItem key={item.title}>
              <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[560px] grid-cols-2 gap-1 p-3">
                  <li className="col-span-2 mb-1 px-3 pt-2">
                    <p className="eyebrow">Shop by goal</p>
                  </li>
                  {item.items.map((child) => (
                    <li key={child.href}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={child.href}
                          className="block rounded-xl p-3 transition-colors hover:bg-secondary/70 focus:bg-secondary/70 focus:outline-none"
                        >
                          <span className="text-sm font-semibold text-foreground">
                            {child.title}
                          </span>
                          {child.description && (
                            <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                              {child.description}
                            </span>
                          )}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                  <li className="col-span-2 mt-1 border-t px-3 py-2.5">
                    <Link
                      href={item.href}
                      className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
                    >
                      Browse all products →
                    </Link>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ) : (
            <NavigationMenuItem key={item.title}>
              <NavigationMenuLink asChild>
                <Link
                  href={item.href}
                  className={cn(
                    navigationMenuTriggerStyle(),
                    pathname === item.href && "text-primary"
                  )}
                  aria-current={pathname === item.href ? "page" : undefined}
                >
                  {item.title}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          )
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
