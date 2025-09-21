import { Skeleton } from "@/components/ui/skeleton";
import PurchaseCardSkeleton from "@/components/ui/purchase-card-skeleton";
import StatsCardSkeleton from "@/components/ui/stats-card-skeleton";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-5 w-64" />
            </div>
          </div>

          {/* Address copy box */}
          <div className="flex flex-col items-end bg-white rounded-lg px-4 py-3 shadow-sm">
            <Skeleton className="h-4 w-32 mb-2" />
            <div className="flex items-center w-full">
              <Button variant="ghost" size="sm" className="ml-2">
                <Skeleton className="w-4 h-4" />
              </Button>
              <Skeleton className="h-4 flex-1 ml-2" />
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCardSkeleton />
        </div>

        {/* Purchase cards skeleton */}
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <PurchaseCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
