import { Skeleton } from "@/components/ui/skeleton";
import PurchaseCardSkeleton from "@/components/ui/purchase-card-skeleton";
import StatsCardSkeleton from "@/components/ui/stats-card-skeleton";

export default function Loading() {
  return (
    <div className="container min-h-[calc(100vh-8.5rem)] mx-auto px-4 py-8">
      <div className="mb-8">
        <Skeleton className="h-9 w-48 mb-2" />
        <Skeleton className="h-5 w-64" />
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCardSkeleton />
      </div>

      {/* List of pending purchases */}
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <PurchaseCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
