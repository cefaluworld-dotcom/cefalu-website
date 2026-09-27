import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/layout/container";

export default function ShopLoading() {
  return (
    <Container size="xl" className="py-12 md:py-16">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="mt-3 h-10 w-72" />
      <Skeleton className="mt-3 h-4 w-96 max-w-full" />
      <div className="mt-10 grid gap-8 lg:grid-cols-[16rem_1fr]">
        <Skeleton className="hidden h-[32rem] rounded-2xl lg:block" />
        <div>
          <div className="mb-6 flex justify-between">
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-9 w-40" />
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}
