"use client";

import { usePathname, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface ShopPaginationProps {
  page: number;
  totalPages: number;
  className?: string;
}

export function ShopPagination({ page, totalPages, className }: ShopPaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const href = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (p <= 1) params.delete("page");
    else params.set("page", String(p));
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <Pagination className={cn(className)}>
      <PaginationContent>
        {page > 1 && (
          <PaginationItem>
            <PaginationPrevious href={href(page - 1)} />
          </PaginationItem>
        )}
        {pages.map((p, i) => (
          <PaginationItem key={p}>
            {i > 0 && pages[i - 1] !== p - 1 && <PaginationEllipsis />}
            <PaginationLink href={href(p)} isActive={p === page}>
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}
        {page < totalPages && (
          <PaginationItem>
            <PaginationNext href={href(page + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
